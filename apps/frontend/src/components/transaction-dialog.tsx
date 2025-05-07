import * as React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeDeposit, makeWithdrawal } from "@/api/transactions";

interface TransactionDialogProps {
  trigger: React.ReactNode;
  mode?: "add" | "edit";
  initialValue?: string;
  initialType?: "deposit" | "withdrawal";
  userId: string;
  onSuccess?: () => void;
}

export function TransactionDialog({
  trigger,
  mode = "add",
  initialValue = "0.00",
  initialType = "deposit",
  userId,
  onSuccess,
}: TransactionDialogProps) {
  const [type, setType] = React.useState<"deposit" | "withdrawal">(initialType);
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState<string | null>(null);
  const translateType = type === "deposit" ? "entrada" : "saída";
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

  const queryClient = useQueryClient();

  const formatAsCurrency = (val: string) => {
    const digits = val.replace(/\D/g, "");

    const numberValue = parseInt(digits) / 100;
    return numberValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAsCurrency(e.target.value);
    setValue(formattedValue);
    setError(null);
  };

  const getNumericAmount = (): number => {
    return parseFloat(value.replace(/\./g, "").replace(",", "."));
  };

  const depositMutation = useMutation({
    mutationFn: (amount: number) => makeDeposit(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.custom(() => (
        <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
          <p className="text-sm">🎉 Valor de {translateType} adicionado</p>
          <span className="text-xs text-neutral-500 font-normal">
            Já pode visualizar na lista
          </span>
        </div>
      ));
      dialogCloseRef.current?.click();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar ${translateType}: ${error.message}`);
    },
  });

  const withdrawalMutation = useMutation({
    mutationFn: (amount: number) => makeWithdrawal(userId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.custom(() => (
        <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
          <p className="text-sm">🎉 Valor de {translateType} adicionado</p>
          <span className="text-xs text-neutral-500 font-normal">
            Já pode visualizar na lista
          </span>
        </div>
      ));
      dialogCloseRef.current?.click();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(`Erro ao adicionar ${translateType}: ${error.message}`);
      setError("Erro ao processar a transação. Verifique o saldo disponível.");
    },
  });

  const handleSubmit = () => {
    const amount = getNumericAmount();

    if (isNaN(amount) || amount <= 0) {
      setError("O valor precisa ser maior que zero");
      return;
    }

    if (type === "deposit") {
      depositMutation.mutate(amount);
    } else {
      withdrawalMutation.mutate(amount);
    }
  };

  const titleText = mode === "add" ? "Quanto você quer adicionar?" : "Valor";
  const isLoading = depositMutation.isPending || withdrawalMutation.isPending;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Currency input */}
          <div className="relative text-2xl font-normal text-neutral-50 text-left mt-3">
            <input
              type="text"
              value={value}
              onChange={handleValueChange}
              className="w-full bg-transparent border-none outline-none focus:ring-0"
              placeholder="0,00"
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-between gap-2 mt-5 items-center">
            <div className="flex bg-neutral-800 rounded-full p-2">
              <Button
                variant="transaction-type"
                state={type === "deposit" ? "active" : "inactive"}
                onClick={() => setType("deposit")}
                className="flex-1 justify-center"
                disabled={isLoading}
              >
                Entrada
              </Button>
              <Button
                variant="transaction-type"
                state={type === "withdrawal" ? "active" : "inactive"}
                onClick={() => setType("withdrawal")}
                className="flex-1 justify-center"
                disabled={isLoading}
              >
                Saída
              </Button>
            </div>
            <DialogClose ref={dialogCloseRef} className="hidden" />
            <Button
              onClick={handleSubmit}
              variant="brand"
              className="w-auto"
              disabled={isLoading}
            >
              {isLoading
                ? "Processando..."
                : mode === "add"
                ? "Adicionar"
                : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
