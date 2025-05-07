import { Button } from "@/components/ui/button";
import { TransactionDialog } from "./transaction-dialog";
import { TrashIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons";

type Transaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
};

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return amount
      .toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(".", ",");
  };

  return (
    <div className="mt-6 space-y-px">
      {transactions.map((transaction, index) => {
        const isFirst = index === 0;
        const isLast = index === transactions.length - 1;

        return (
          <div
            key={transaction.id}
            className={`flex justify-between items-center p-4 bg-neutral-900 ${
              isFirst ? "rounded-t-lg" : ""
            } ${isLast ? "rounded-b-lg" : ""}`}
          >
            <div className="flex items-center gap-2">
              {transaction.type === "income" ? (
                <DownloadIcon className="text-positive-50" />
              ) : (
                <UploadIcon className="text-destructive" />
              )}
              <span
                className={
                  transaction.type === "income"
                    ? "text-positive-50"
                    : "text-destructive"
                }
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>

            <TransactionDialog
              trigger={
                <Button variant="icon-destructive">
                  <TrashIcon className="size-4" />
                </Button>
              }
            />
          </div>
        );
      })}
    </div>
  );
}
