import { Button } from "@/components/ui/button";
import { TransactionDialog } from "./transaction-dialog";
import { TrashIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons";
import type { Transaction } from "@4p.finance/schemas";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TransactionTable({
  transactions,
  onDelete,
  isLoading = false,
}: TransactionTableProps) {
  const formatCurrency = (amount: number) => {
    return amount
      .toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      .replace(".", ",");
  };

  if (isLoading) {
    return (
      <div className="mt-6 space-y-px">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="flex justify-between items-center p-4 bg-neutral-900 border-b border-neutral-800 first:rounded-t-lg last:rounded-b-lg animate-pulse"
          >
            <div className="flex items-center gap-2 flex-grow">
              <div className="w-4 h-4 rounded-full bg-neutral-800"></div>
              <div className="h-4 w-24 bg-neutral-800 rounded"></div>
            </div>
            <div className="w-8 h-8 rounded-md bg-neutral-800"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-px">
      {transactions.length === 0 ? (
        <div className="flex justify-center items-center p-8 bg-neutral-900 rounded-lg text-neutral-500">
          Nenhuma transação encontrada.
        </div>
      ) : (
        transactions.map((transaction) => {
          return (
            <div
              key={transaction.id}
              className="flex justify-between items-center p-4 bg-neutral-900 border-b border-neutral-800 first:rounded-t-lg last:rounded-b-lg"
            >
              <TransactionDialog
                mode="edit"
                initialValue={transaction.amount.toString()}
                initialType={transaction.type}
                trigger={
                  <div className="flex items-center gap-2 hover:cursor-pointer flex-grow">
                    {transaction.type === "deposit" ? (
                      <DownloadIcon className="text-positive-50" />
                    ) : (
                      <UploadIcon className="text-destructive" />
                    )}
                    <span
                      className={
                        transaction.type === "deposit"
                          ? "text-positive-50"
                          : "text-destructive"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                    {transaction.description && (
                      <span className="text-neutral-500 text-xs ml-2">
                        {transaction.description}
                      </span>
                    )}
                  </div>
                }
              />

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(transaction.id);
                }}
                variant="icon-destructive"
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
}
