import ky from "ky";
import { statementSchema, type Statement } from "@4p.finance/schemas";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTransactions(userId: string): Promise<Statement> {
  const response = await ky.get(`${API_URL}/users/${userId}/statement`).json();
  return statementSchema.parse(response);
}
