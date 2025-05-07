import { db } from "../db";
import { users, transactions } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import {
  CreateUserPayload,
  DepositPayload,
  WithdrawalPayload,
} from "@4p.finance/schemas";

class Mutex {
  private locked = false;
  private queue: (() => void)[] = [];

  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.locked) {
        this.locked = true;
        resolve();
      } else {
        this.queue.push(resolve);
      }
    });
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      if (next) {
        next();
        return;
      }
    }
    this.locked = false;
  }
}

const userBalanceMutex = new Map<string, Mutex>();

function getUserMutex(userId: string): Mutex {
  if (!userBalanceMutex.has(userId)) {
    userBalanceMutex.set(userId, new Mutex());
  }
  return userBalanceMutex.get(userId)!;
}

export const userService = {
  async createUser(data: CreateUserPayload) {
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        balance: data.initialBalance * 100,
      })
      .returning();
    return { ...newUser, balance: newUser.balance / 100 };
  },

  async getUserById(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) return null;
    return { ...user, balance: user.balance / 100 };
  },

  async deposit(userId: string, data: DepositPayload) {
    const mutex = getUserMutex(userId);
    await mutex.acquire();
    try {
      const result = await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId),
          for: "update" as never,
        });
        if (!user) {
          throw new Error("User not found");
        }

        const newBalance = user.balance + data.amount * 100;

        await tx
          .update(users)
          .set({ balance: newBalance, updatedAt: sql`(strftime('%s', 'now'))` })
          .where(eq(users.id, userId));

        const [newTransaction] = await tx
          .insert(transactions)
          .values({
            userId,
            type: "deposit",
            amount: data.amount * 100,
            description: data.description,
          })
          .returning();

        return { ...newTransaction, balance: newBalance / 100 };
      });
      return result;
    } finally {
      mutex.release();
    }
  },

  async withdraw(userId: string, data: WithdrawalPayload) {
    const mutex = getUserMutex(userId);
    await mutex.acquire();
    try {
      const result = await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId),
          for: "update" as never,
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (user.balance < data.amount * 100) {
          throw new Error("Insufficient funds");
        }

        const newBalance = user.balance - data.amount * 100;

        await tx
          .update(users)
          .set({ balance: newBalance, updatedAt: sql`(strftime('%s', 'now'))` })
          .where(eq(users.id, userId));

        const [newTransaction] = await tx
          .insert(transactions)
          .values({
            userId,
            type: "withdrawal",
            amount: data.amount * 100,
            description: data.description,
          })
          .returning();
        return { ...newTransaction, balance: newBalance / 100 };
      });
      return result;
    } finally {
      mutex.release();
    }
  },

  async getStatement(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new Error("User not found");
    }
    const userTransactions = await db.query.transactions.findMany({
      where: eq(transactions.userId, userId),
      orderBy: (transactions, { desc }) => [desc(transactions.timestamp)],
    });

    return {
      currentBalance: user.balance / 100,
      transactions: userTransactions.map((t) => ({
        ...t,
        amount: t.amount / 100,
      })),
    };
  },

  async updateTransaction(
    transactionId: string,
    data: { amount: number; type: "deposit" | "withdrawal" }
  ) {
    const existingTransaction = await db.query.transactions.findFirst({
      where: eq(transactions.id, transactionId),
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    const userId = existingTransaction.userId;
    const mutex = getUserMutex(userId);
    await mutex.acquire();

    try {
      return await db.transaction(async (tx) => {
        const user = await tx.query.users.findFirst({
          where: eq(users.id, userId),
          for: "update" as never,
        });

        if (!user) {
          throw new Error("User not found");
        }

        const oldAmountInCents = existingTransaction.amount;
        const newAmountInCents = data.amount * 100;

        let balanceAdjustment = 0;

        if (existingTransaction.type === "deposit") {
          balanceAdjustment -= oldAmountInCents;
        } else {
          balanceAdjustment += oldAmountInCents;
        }

        if (data.type === "deposit") {
          balanceAdjustment += newAmountInCents;
        } else {
          balanceAdjustment -= newAmountInCents;
        }

        const newBalance = user.balance + balanceAdjustment;
        if (newBalance < 0) {
          throw new Error("Insufficient funds");
        }

        await tx
          .update(users)
          .set({ balance: newBalance, updatedAt: sql`(strftime('%s', 'now'))` })
          .where(eq(users.id, userId));

        const [updatedTransaction] = await tx
          .update(transactions)
          .set({
            amount: newAmountInCents,
            type: data.type,
            timestamp: sql`(strftime('%s', 'now'))`,
          })
          .where(eq(transactions.id, transactionId))
          .returning();

        return {
          ...updatedTransaction,
          amount: updatedTransaction.amount / 100,
          balance: newBalance / 100,
        };
      });
    } finally {
      mutex.release();
    }
  },
};
