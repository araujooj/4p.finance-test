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

function App() {
  const [selectedTab, setSelectedTab] = useQueryState("selectedTab", {
    defaultValue: "all",
  });

  // Use a constant for userId
  const userId = "5888ddc9-b8be-4b0d-b04e-f06faef0e100";

  // Check if we should show deleted items
  const showDeleted = selectedTab === "deleted";

  // Fetch transactions, include deleted ones if on deleted tab
  const { data, isLoading } = useQuery({
    queryKey: ["transactions", showDeleted],
    queryFn: () => getTransactions(userId, showDeleted),
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

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full px-4 py-6 sm:py-10 max-w-screen-lg mx-auto">
        <Logo />
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

export default App;
