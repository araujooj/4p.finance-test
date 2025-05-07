import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  initialBalance: z
    .number()
    .int()
    .nonnegative("Initial balance must be a non-negative integer")
    .optional()
    .default(0),
});

export const depositSchema = z.object({
  amount: z.number().positive("Deposit amount must be positive"),
  description: z.string().optional(),
});

export const withdrawalSchema = z.object({
  amount: z.number().positive("Withdrawal amount must be positive"),
  description: z.string().optional(),
});

export const transactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(["deposit", "withdrawal"]),
  amount: z.number().positive(),
  description: z.string().nullable(),
  timestamp: z.string().datetime(),
  deleted: z.boolean().optional().default(false),
});

export const statementSchema = z.object({
  currentBalance: z.number(),
  transactions: z.array(transactionSchema),
});

export const updateTransactionSchema = z.object({
  amount: z.number().positive("Transaction amount must be positive"),
  type: z.enum(["deposit", "withdrawal"]),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type DepositPayload = z.infer<typeof depositSchema>;
export type WithdrawalPayload = z.infer<typeof withdrawalSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type Statement = z.infer<typeof statementSchema>;
export type UpdateTransactionPayload = z.infer<typeof updateTransactionSchema>;
