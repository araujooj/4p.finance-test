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
import { useUser } from "@/context/user-context";

interface UserCreationDialogProps {
  trigger: React.ReactNode;
}

export function UserCreationDialog({ trigger }: UserCreationDialogProps) {
  const [name, setName] = React.useState("");
  const [initialBalance, setInitialBalance] = React.useState("0,00");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const dialogCloseRef = React.useRef<HTMLButtonElement>(null);
  const { createNewUser } = useUser();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError(null);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const numberValue = parseInt(digits || "0") / 100;
    setInitialBalance(
      numberValue.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
    setError(null);
  };

  const handleSubmit = async () => {
    if (!name) {
      setError("Nome é obrigatório");
      return;
    }

    try {
      setIsLoading(true);
      const balanceValue = parseFloat(
        initialBalance.replace(/\./g, "").replace(",", ".")
      );
      await createNewUser(name, balanceValue);
      toast.custom(() => (
        <div className="min-w-82 bg-neutral-900 text-neutral-50 rounded-lg font-normal p-4">
          <p className="text-sm">🎉 Conta criada com sucesso!</p>
          <span className="text-xs text-neutral-500 font-normal">
            Agora você pode adicionar transações
          </span>
        </div>
      ));
      dialogCloseRef.current?.click();
    } catch (error) {
      console.error(error);
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground font-bold">
            Criar nova conta
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="space-y-4">
            <label className="text-sm text-neutral-500">Nome</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full mt-2 bg-neutral-800 border border-neutral-700 p-2 rounded-md text-neutral-50"
              placeholder="Seu nome"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm text-neutral-500">Saldo inicial</label>
            <div className="relative">
              <span className="absolute mt-1 left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
                R$
              </span>
              <input
                type="text"
                value={initialBalance}
                onChange={handleBalanceChange}
                className="w-full ml-1 mt-2 bg-neutral-800 border border-neutral-700 p-2 pl-8 rounded-md text-neutral-50"
                placeholder="0,00"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 mt-5">
            <DialogClose ref={dialogCloseRef} asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={handleSubmit} variant="brand" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar conta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
