import ky from "ky";
import {
  statementSchema,
  depositSchema,
  withdrawalSchema,
  updateTransactionSchema,
  type Statement,
} from "@4p.finance/schemas";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTransactions(
  userId: string,
  includeDeleted: boolean = false
): Promise<Statement> {
  const response = await ky
    .get(
      `${API_URL}/users/${userId}/statement?includeDeleted=${includeDeleted}`
    )
    .json();
  return statementSchema.parse(response);
}

export async function makeDeposit(userId: string, amount: number) {
  const data = { amount };
  depositSchema.parse(data);

  const response = await ky
    .post(`${API_URL}/users/${userId}/deposit`, {
      json: data,
    })
    .json();

  return response;
}

export async function makeWithdrawal(userId: string, amount: number) {
  const data = { amount };
  withdrawalSchema.parse(data);

  const response = await ky
    .post(`${API_URL}/users/${userId}/withdraw`, {
      json: data,
    })
    .json();

  return response;
}

export async function updateTransaction(
  transactionId: string,
  amount: number,
  type: "deposit" | "withdrawal"
) {
  const data = { amount, type };
  updateTransactionSchema.parse(data);

  const response = await ky
    .put(`${API_URL}/users/transactions/${transactionId}`, {
      json: data,
    })
    .json();

  return response;
}

export async function deleteTransaction(transactionId: string) {
  const response = await ky
    .delete(`${API_URL}/users/transactions/${transactionId}`)
    .json();
  return response;
}

export async function restoreTransaction(transactionId: string) {
  const response = await ky
    .post(`${API_URL}/users/transactions/${transactionId}/restore`)
    .json();
  return response;
}

export async function createUser(name: string, initialBalance?: number) {
  const response = await ky
    .post(`${API_URL}/users`, {
      json: { name, initialBalance: initialBalance || 0 },
    })
    .json();

  return response as {
    id: string;
    name: string;
  };
}
