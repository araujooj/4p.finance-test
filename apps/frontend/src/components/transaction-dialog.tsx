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

interface TransactionDialogProps {
  trigger: React.ReactNode;
  mode?: "add" | "edit";
  initialValue?: string;
  initialType?: "deposit" | "withdrawal";
  showError?: boolean;
}

export function TransactionDialog({
  trigger,
  mode = "add",
  initialValue = "0.00",
  initialType = "deposit",
  showError = false,
}: TransactionDialogProps) {
  const [type, setType] = React.useState<"deposit" | "withdrawal">(initialType);
  const [value, setValue] = React.useState(initialValue);
  const translateType = type === "deposit" ? "entrada" : "saída";

  const titleText = mode === "add" ? "Quanto você quer adicionar?" : "Valor";

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{titleText}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          {/* Replace with a proper currency input later */}
          <div className="text-2xl font-normal text-neutral-50 text-left mt-3">
            {value}
          </div>
          {showError && mode === "add" && (
            <p className="text-xs text-destructive">
              O valor precisa ser diferente de 0.00
            </p>
          )}

          <div className="flex justify-between gap-2 mt-5 items-center">
            <div className="flex bg-neutral-800 rounded-full p-2">
              <Button
                variant="transaction-type"
                state={type === "deposit" ? "active" : "inactive"}
                onClick={() => setType("deposit")}
                className="flex-1 justify-center"
              >
                Entrada
              </Button>
              <Button
                variant="transaction-type"
                state={type === "withdrawal" ? "active" : "inactive"}
                onClick={() => setType("withdrawal")}
                className="flex-1 justify-center"
              >
                Saída
              </Button>
            </div>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  toast.custom(() => (
                    <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
                      <p className="text-sm">
                        🎉 Valor de {translateType} adicionado
                      </p>
                      <span className="text-xs text-neutral-500 font-normal">
                        Já pode visualizar na lista
                      </span>
                    </div>
                  ));
                }}
                variant="brand"
                className="w-auto"
              >
                {mode === "add" ? "Adicionar" : "Salvar alterações"}
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
