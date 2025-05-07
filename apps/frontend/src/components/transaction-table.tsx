import { Button } from "@/components/ui/button";
import { TransactionDialog } from "./transaction-dialog";
import { TrashIcon, UploadIcon, DownloadIcon } from "@radix-ui/react-icons";
import type { Transaction } from "@4p.finance/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, restoreTransaction } from "@/api/transactions";
import { toast } from "sonner";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
  userId: string;
  showDeleted?: boolean;
}

export function TransactionTable({
  transactions,
  isLoading = false,
  userId,
}: TransactionTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.custom(() => (
        <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
          <p className="text-sm">Valor excluído</p>
          <span className="text-xs text-neutral-500 font-normal">
            Já pode visualizar na pasta de{" "}
            <strong className="text-foreground font-medium underline">
              excluídos
            </strong>
          </span>
        </div>
      ));
    },
    onError: (error) => {
      toast.error(`Erro ao excluir: ${error.message}`);
    },
  });

  const restoreMutation = useMutation({
    mutationFn: (id: string) => restoreTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.custom(() => (
        <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
          <p className="text-sm">Valor restaurado</p>
          <span className="text-xs text-neutral-500 font-normal">
            Já pode visualizar na lista
          </span>
        </div>
      ));
    },
    onError: (error) => {
      toast.error(`Erro ao restaurar: ${error.message}`);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleRestore = (id: string) => {
    restoreMutation.mutate(id);
  };

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
        <div className="flex flex-col justify-center items-center p-8 mt-30 max-w-sm mx-auto text-center rounded-lg text-neutral-500">
          <p className="text-lg text-foreground">
            Nenhum lançamento cadastrado
          </p>
          <span className="text-sm text-neutral-500">
            Caso para adicionar clique em novo valor ou se quiser resgatar um
            antigo clique em excluídos
          </span>
        </div>
      ) : (
        transactions.map((transaction) => {
          const isDeleted = Boolean(transaction.deleted);
          return (
            <div
              key={transaction.id}
              className={`flex justify-between items-center p-4 bg-neutral-900 border-b border-neutral-800 first:rounded-t-lg last:rounded-b-lg ${
                isDeleted ? "opacity-60" : ""
              }`}
            >
              {!isDeleted ? (
                <TransactionDialog
                  mode="edit"
                  initialValue={transaction.amount.toString()}
                  initialType={transaction.type}
                  transactionId={transaction.id}
                  userId={userId}
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
              ) : (
                <div className="flex items-center gap-2 flex-grow">
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
                  <span className="text-neutral-500 text-xs ml-2 italic">
                    (Excluído)
                  </span>
                </div>
              )}

              {!isDeleted ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(transaction.id);
                  }}
                  variant="icon-destructive"
                  disabled={deleteMutation.isPending}
                >
                  <TrashIcon className="size-4" />
                </Button>
              ) : (
                <Button
                  className="opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestore(transaction.id);
                  }}
                  disabled={restoreMutation.isPending}
                >
                  Restaurar
                </Button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
