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
  amount: z
    .number()
    .int()
    .positive("Deposit amount must be a positive integer"),
  description: z.string().optional(),
});

export const withdrawalSchema = z.object({
  amount: z
    .number()
    .int()
    .positive("Withdrawal amount must be a positive integer"),
  description: z.string().optional(),
});

export type CreateUserPayload = z.infer<typeof createUserSchema>;
export type DepositPayload = z.infer<typeof depositSchema>;
export type WithdrawalPayload = z.infer<typeof withdrawalSchema>;
