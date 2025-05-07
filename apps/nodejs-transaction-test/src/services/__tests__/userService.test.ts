/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { userService } from "../userService";
import { db } from "../../db";

// Mock the database
vi.mock("../../db", () => {
  return {
    db: {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      query: {
        users: {
          findFirst: vi.fn(),
        },
        transactions: {
          findMany: vi.fn(),
        },
      },
      transaction: vi.fn(),
      update: vi.fn().mockReturnThis(),
      where: vi.fn(),
    },
  };
});

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("createUser", () => {
    it("should create a user with initial balance", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 1000 };
      //@ts-ignore
      vi.mocked(db.insert().values().returning).mockResolvedValue([mockUser]);

      const result = await userService.createUser({
        name: "Test User",
        initialBalance: 10,
      });

      expect(db.insert).toHaveBeenCalled();
      expect(result).toEqual({ ...mockUser, balance: 10 });
    });
  });

  describe("getUserById", () => {
    it("should return user if found", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 1000 };
      //@ts-ignore
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser);

      const result = await userService.getUserById("123");

      expect(db.query.users.findFirst).toHaveBeenCalled();
      expect(result).toEqual({ ...mockUser, balance: 10 });
    });

    it("should return null if user not found", async () => {
      //@ts-ignore
      vi.mocked(db.query.users.findFirst).mockResolvedValue(null);

      const result = await userService.getUserById("123");

      expect(result).toBeNull();
    });
  });

  describe("deposit", () => {
    it("should increase user balance on deposit", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 1000 };
      const mockTransaction = {
        id: "tx1",
        userId: "123",
        type: "deposit",
        amount: 500,
      };

      vi.mocked(db.transaction).mockImplementation(async (callback) => {
        return callback({
          query: {
            //@ts-ignore
            users: {
              findFirst: vi.fn().mockResolvedValue(mockUser),
            },
          },
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn(),
          insert: vi.fn().mockReturnThis(),
          values: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([mockTransaction]),
        });
      });

      const result = await userService.deposit("123", {
        amount: 5,
        description: "Test deposit",
      });

      expect(db.transaction).toHaveBeenCalled();
      expect(result.balance).toBe(15); // 10 original + 5 deposit
    });

    it("should throw error if user not found during deposit", async () => {
      vi.mocked(db.transaction).mockImplementation(async (callback) => {
        return callback({
          query: {
            //@ts-ignore
            users: {
              findFirst: vi.fn().mockResolvedValue(null),
            },
          },
          update: vi.fn(),
          insert: vi.fn(),
        });
      });

      await expect(
        userService.deposit("invalid-id", { amount: 5 })
      ).rejects.toThrow("User not found");
    });
  });

  describe("withdraw", () => {
    it("should decrease user balance on withdrawal", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 1000 };
      const mockTransaction = {
        id: "tx1",
        userId: "123",
        type: "withdrawal",
        amount: 500,
      };

      vi.mocked(db.transaction).mockImplementation(async (callback) => {
        return callback({
          query: {
            //@ts-ignore
            users: {
              findFirst: vi.fn().mockResolvedValue(mockUser),
            },
          },
          update: vi.fn().mockReturnThis(),
          set: vi.fn().mockReturnThis(),
          where: vi.fn(),
          insert: vi.fn().mockReturnThis(),
          values: vi.fn().mockReturnThis(),
          returning: vi.fn().mockResolvedValue([mockTransaction]),
        });
      });

      const result = await userService.withdraw("123", {
        amount: 5,
        description: "Test withdrawal",
      });

      expect(db.transaction).toHaveBeenCalled();
      expect(result.balance).toBe(5); // 10 original - 5 withdrawal
    });

    it("should throw error if insufficient funds", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 200 }; // $2.00

      vi.mocked(db.transaction).mockImplementation(async (callback) => {
        return callback({
          query: {
            //@ts-ignore
            users: {
              findFirst: vi.fn().mockResolvedValue(mockUser),
            },
          },
          update: vi.fn(),
          insert: vi.fn(),
        });
      });

      await expect(userService.withdraw("123", { amount: 5 })).rejects.toThrow(
        "Insufficient funds"
      );
    });
  });

  describe("getStatement", () => {
    it("should return statement with transactions", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 1000 };
      const mockTransactions = [
        {
          id: "tx1",
          userId: "123",
          type: "deposit",
          amount: 500,
          timestamp: new Date(),
        },
        {
          id: "tx2",
          userId: "123",
          type: "withdrawal",
          amount: 200,
          timestamp: new Date(),
        },
      ];
      //@ts-ignore
      vi.mocked(db.query.users.findFirst).mockResolvedValue(mockUser);
      vi.mocked(db.query.transactions.findMany).mockResolvedValue(
        //@ts-ignore
        mockTransactions
      );

      const result = await userService.getStatement("123");

      expect(result.currentBalance).toBe(10);
      expect(result.transactions).toHaveLength(2);
      expect(result.transactions[0].amount).toBe(5);
      expect(result.transactions[1].amount).toBe(2);
    });
  });
});
