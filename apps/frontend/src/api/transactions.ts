import ky from "ky";
import {
  statementSchema,
  depositSchema,
  withdrawalSchema,
  type Statement,
} from "@4p.finance/schemas";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTransactions(userId: string): Promise<Statement> {
  const response = await ky.get(`${API_URL}/users/${userId}/statement`).json();
  return statementSchema.parse(response);
}

export async function makeDeposit(userId: string, amount: number) {
  const data = { amount };
  depositSchema.parse(data); // Validate before sending

  const response = await ky
    .post(`${API_URL}/users/${userId}/deposit`, {
      json: data,
    })
    .json();

  return response;
}

export async function makeWithdrawal(userId: string, amount: number) {
  const data = { amount };
  withdrawalSchema.parse(data); // Validate before sending

  const response = await ky
    .post(`${API_URL}/users/${userId}/withdraw`, {
      json: data,
    })
    .json();

  return response;
}
