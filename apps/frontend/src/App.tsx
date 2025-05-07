import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  DashboardIcon,
  UploadIcon,
  DownloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { TransactionDialog } from "./components/transaction-dialog";
import { TransactionTable } from "./components/transaction-table";
import { useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "./api/transactions";
import { useUser } from "./context/user-context";
import { UserSelector } from "./components/user-selector";

function TransactionApp() {
  const [selectedTab, setSelectedTab] = useQueryState("selectedTab", {
    defaultValue: "all",
  });

  const { currentUser, isLoading: userLoading } = useUser();
  const userId = currentUser?.id;

  // Check if we should show deleted items
  const showDeleted = selectedTab === "deleted";

  // Fetch transactions, include deleted ones if on deleted tab
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", userId, showDeleted],
    queryFn: () => {
      if (!userId) return { currentBalance: 0, transactions: [] };
      return getTransactions(userId, showDeleted);
    },
    enabled: !!userId,
  });

  // Filter transactions based on selected tab
  const filteredTransactions =
    data?.transactions.filter((transaction) => {
      if (selectedTab === "all") return !transaction.deleted;
      if (selectedTab === "entries")
        return transaction.type === "deposit" && !transaction.deleted;
      if (selectedTab === "withdrawals")
        return transaction.type === "withdrawal" && !transaction.deleted;
      if (selectedTab === "deleted") return Boolean(transaction.deleted);
      return !transaction.deleted;
    }) || [];

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4 text-center">
        <Logo />
        <h1 className="text-2xl font-bold">Bem-vindo ao 4p.finance</h1>
        <p className="text-neutral-500 max-w-md">
          Para começar, crie uma conta para gerenciar suas finanças
        </p>
        <UserSelector />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full px-4 py-6 sm:py-10 max-w-screen-lg mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Logo />
          <UserSelector />
        </div>
        <TransactionDialog
          trigger={<Button variant="brand">Novo valor</Button>}
          mode="add"
          userId={userId}
        />
      </header>
      <main className="flex-1 w-full max-w-screen-lg mx-auto mt-8 sm:mt-20 px-4 pb-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              state={selectedTab === "all" ? "active" : "inactive"}
              onClick={() => setSelectedTab("all")}
              className="w-full sm:w-auto"
            >
              <DashboardIcon />
              Todos
            </Button>
            <Button
              state={selectedTab === "entries" ? "active" : "inactive"}
              onClick={() => setSelectedTab("entries")}
              className="w-full sm:w-auto"
            >
              <DownloadIcon />
              Entradas
            </Button>
            <Button
              state={selectedTab === "withdrawals" ? "active" : "inactive"}
              onClick={() => setSelectedTab("withdrawals")}
              className="w-full sm:w-auto"
            >
              <UploadIcon />
              Saídas
            </Button>
          </div>
          <Button
            state={selectedTab === "deleted" ? "active" : "inactive"}
            onClick={() => setSelectedTab("deleted")}
            className="w-full sm:w-auto"
          >
            <TrashIcon />
            Excluídos
          </Button>
        </div>

        {data && !showDeleted && (
          <div className="mt-8 p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
            <p className="text-neutral-500 text-sm mb-1">Saldo atual</p>
            <p
              className={`text-2xl font-bold ${
                data.currentBalance >= 0
                  ? "text-positive-50"
                  : "text-destructive"
              }`}
            >
              {data.currentBalance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        )}

        <TransactionTable
          transactions={filteredTransactions}
          isLoading={isLoading}
          userId={userId}
          showDeleted={showDeleted}
        />
      </main>
    </div>
  );
}

export default TransactionApp;
