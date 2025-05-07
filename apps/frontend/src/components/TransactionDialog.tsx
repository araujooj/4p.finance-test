import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose, // If you need a separate close button in the footer
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TransactionDialogProps {
  trigger: React.ReactNode;
  mode?: "add" | "edit";
  initialValue?: string;
  initialType?: "income" | "expense";
  showError?: boolean;
}

export function TransactionDialog({
  trigger,
  mode = "add",
  initialValue = "0.00",
  initialType = "income",
  showError = false,
}: TransactionDialogProps) {
  const [type, setType] = React.useState<"income" | "expense">(initialType);
  const [value, setValue] = React.useState(initialValue);

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
                state={type === "income" ? "active" : "inactive"}
                onClick={() => setType("income")}
                className="flex-1 justify-center"
              >
                Entrada
              </Button>
              <Button
                variant="transaction-type"
                state={type === "expense" ? "active" : "inactive"}
                onClick={() => setType("expense")}
                className="flex-1 justify-center"
              >
                Saída
              </Button>
            </div>
            <Button variant="brand" className="w-auto">
              {mode === "add" ? "Adicionar" : "Salvar alterações"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
