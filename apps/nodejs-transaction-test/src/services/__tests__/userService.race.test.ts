/// <reference types="vitest" />
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { userService } from "../userService";
import { db } from "../../db";

// Mock the database
vi.mock("../../db", () => {
  return {
    db: {
      transaction: vi.fn(),
      query: {
        users: {
          findFirst: vi.fn(),
        },
        transactions: {
          findMany: vi.fn(),
        },
      },
    },
  };
});

// This test simulates concurrent operations to verify race condition handling

describe("userService - Race Condition Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should handle concurrent deposits correctly", async () => {
    let currentBalance = 1000; // $10.00

    // Mock the transaction function to simulate DB operations with a delay
    //@ts-ignore
    db.transaction.mockImplementation(async (callback) => {
      // Create a mock transaction context that simulates the database
      const user = { id: "123", name: "Test User", balance: currentBalance };

      const mockTx = {
        query: {
          users: {
            findFirst: vi.fn().mockImplementation(async () => {
              // Return a copy of current user state
              return { ...user };
            }),
          },
        },
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockImplementation((data) => {
          // Update the "database" balance
          currentBalance = data.balance;
          return mockTx;
        }),
        where: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockImplementation(() => {
          return [{ id: "tx1", userId: "123", type: "deposit", amount: 500 }];
        }),
      };

      return callback(mockTx);
    });

    // Start two concurrent deposit operations
    const deposit1 = userService.deposit("123", { amount: 5 }); // $5.00
    const deposit2 = userService.deposit("123", { amount: 8 }); // $8.00

    // Wait for both to complete
    const [result1, result2] = await Promise.all([deposit1, deposit2]);

    // Final balance should be initial $10 + $5 + $8 = $23
    expect(currentBalance).toBe(2300);

    // Verify the returned balances correctly reflect the sequence
    // The exact values depend on which operation completed first
    expect(result1.balance + result2.balance).toBe(38); // $15 + $23 = $38
  });

  it("should prevent overdrafts during concurrent withdrawals", async () => {
    let currentBalance = 1000; // $10.00
    let withdrawalAttempts = 0;

    //@ts-ignore
    db.transaction.mockImplementation(async (callback) => {
      withdrawalAttempts++;

      // Create a mock transaction context
      const mockTx = {
        query: {
          users: {
            findFirst: vi.fn().mockImplementation(async () => {
              // Return current balance
              return { id: "123", name: "Test User", balance: currentBalance };
            }),
          },
        },
        update: vi.fn().mockReturnThis(),
        set: vi.fn().mockImplementation((data) => {
          currentBalance = data.balance;
          return mockTx;
        }),
        where: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        values: vi.fn().mockReturnThis(),
        returning: vi.fn().mockImplementation(() => {
          return [
            { id: "tx1", userId: "123", type: "withdrawal", amount: 500 },
          ];
        }),
      };

      return callback(mockTx);
    });

    // Start two concurrent withdrawal operations that together exceed the balance
    const withdrawal1 = userService.withdraw("123", { amount: 7 }); // $7.00
    const withdrawal2 = userService.withdraw("123", { amount: 6 }); // $6.00

    // One should succeed and one should fail
    try {
      const results = await Promise.allSettled([withdrawal1, withdrawal2]);

      // Count successful withdrawals
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      // Only one should succeed
      expect(successful).toBe(1);
      expect(failed).toBe(1);

      // Balance should be reduced by only the successful withdrawal
      expect(currentBalance).toBe(300); // $3.00 remaining

      // Should have attempted both withdrawals
      expect(withdrawalAttempts).toBe(2);
    } catch (error) {
      // This catch shouldn't execute if the mutex is working correctly
      expect(error).toBeUndefined();
    }
  });
});
