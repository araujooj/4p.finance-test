import { Router, RequestHandler } from "express";
import { userService } from "../services/userService";
import {
  createUserSchema,
  depositSchema,
  withdrawalSchema,
  updateTransactionSchema,
} from "@4p.finance/schemas";

export const userRouter = Router();

// Create User
userRouter.post("/", (async (req, res) => {
  try {
    const validationResult = createUserSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Falha na validação dos dados",
        errors: validationResult.error.format(),
        expectedSchema: {
          name: "string (obrigatório)",
          initialBalance: "número (opcional, padrão: 0)",
        },
      });
    }
    const newUser = await userService.createUser(validationResult.data);
    res.status(201).json(newUser);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to create user", error: error.message });
  }
}) as RequestHandler);

// Get User (including balance)
userRouter.get("/:userId", (async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to get user", error: error.message });
  }
}) as RequestHandler);

// Deposit
userRouter.post("/:userId/deposit", (async (req, res) => {
  try {
    const validationResult = depositSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Falha na validação dos dados",
        errors: validationResult.error.format(),
        expectedSchema: {
          amount:
            "número positivo em unidades monetárias (ex: 10.50 = R$10,50)",
          description: "string (opcional)",
        },
      });
    }
    const result = await userService.deposit(
      req.params.userId,
      validationResult.data
    );
    res.json(result);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to deposit", error: error.message });
  }
}) as RequestHandler);

// Withdraw
userRouter.post("/:userId/withdraw", (async (req, res) => {
  try {
    const validationResult = withdrawalSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Falha na validação dos dados",
        errors: validationResult.error.format(),
        expectedSchema: {
          amount:
            "número positivo em unidades monetárias (ex: 10.50 = R$10,50)",
          description: "string (opcional)",
        },
      });
    }
    const result = await userService.withdraw(
      req.params.userId,
      validationResult.data
    );
    res.json(result);
  } catch (error: any) {
    if (
      error.message === "User not found" ||
      error.message === "Insufficient funds"
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to withdraw", error: error.message });
  }
}) as RequestHandler);

// Get Statement
userRouter.get("/:userId/statement", (async (req, res) => {
  try {
    const includeDeleted = req.query.includeDeleted === "true";
    const statement = await userService.getStatement(
      req.params.userId,
      includeDeleted
    );
    res.json(statement);
  } catch (error: any) {
    if (error.message === "User not found") {
      return res.status(404).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to get statement", error: error.message });
  }
}) as RequestHandler);

// Update Transaction
userRouter.put("/transactions/:transactionId", (async (req, res) => {
  try {
    const validationResult = updateTransactionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Falha na validação dos dados",
        errors: validationResult.error.format(),
        expectedSchema: {
          amount:
            "número positivo em unidades monetárias (ex: 10.50 = R$10,50)",
          type: "tipo de transação ('deposit' ou 'withdrawal')",
        },
      });
    }

    const result = await userService.updateTransaction(
      req.params.transactionId,
      validationResult.data
    );

    res.json(result);
  } catch (error: any) {
    if (error.message === "Transaction not found") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "User not found" ||
      error.message === "Insufficient funds"
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to update transaction", error: error.message });
  }
}) as RequestHandler);

// Soft Delete Transaction
userRouter.delete("/transactions/:transactionId", (async (req, res) => {
  try {
    const result = await userService.softDeleteTransaction(
      req.params.transactionId
    );
    res.json(result);
  } catch (error: any) {
    if (error.message === "Transaction not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "User not found") {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to delete transaction", error: error.message });
  }
}) as RequestHandler);

// Restore Transaction
userRouter.post("/transactions/:transactionId/restore", (async (req, res) => {
  try {
    const result = await userService.restoreTransaction(
      req.params.transactionId
    );
    res.json(result);
  } catch (error: any) {
    if (error.message === "Transaction not found or not deleted") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message === "User not found" ||
      error.message === "Insufficient funds to restore this withdrawal"
    ) {
      return res.status(400).json({ message: error.message });
    }
    res
      .status(500)
      .json({ message: "Failed to restore transaction", error: error.message });
  }
}) as RequestHandler);
