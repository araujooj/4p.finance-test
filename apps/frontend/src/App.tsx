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

const userId = "5888ddc9-b8be-4b0d-b04e-f06faef0e100";

function App() {
  const [selectedTab, setSelectedTab] = useQueryState("selectedTab", {
    defaultValue: "all",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(userId),
  });

  const filteredTransactions =
    data?.transactions.filter((transaction) => {
      if (selectedTab === "all") return true;
      if (selectedTab === "entries") return transaction.type === "deposit";
      if (selectedTab === "withdrawals")
        return transaction.type === "withdrawal";
      if (selectedTab === "deleted") return false;
      return true;
    }) || [];

  const handleDelete = (id: string) => {
    console.log(`Delete transaction: ${id}`);
  };

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

        {data && (
          <div className="mt-8 text-xl font-bold text-neutral-50">
            Saldo atual:{" "}
            {data.currentBalance.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        )}

        <TransactionTable
          transactions={filteredTransactions}
          onDelete={handleDelete}
          isLoading={isLoading}
          userId={userId}
        />
      </main>
    </div>
  );
}

export default App;
