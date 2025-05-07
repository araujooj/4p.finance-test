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
import { useState } from "react";

const initialTransactions = [
  { id: "1", amount: 1223.42, type: "income" as const },
  { id: "2", amount: 40.2, type: "income" as const },
  { id: "3", amount: 2209.22, type: "income" as const },
  { id: "4", amount: 5223.42, type: "expense" as const },
  { id: "5", amount: 10223.42, type: "income" as const },
  { id: "6", amount: 253.26, type: "income" as const },
  { id: "7", amount: 900.0, type: "expense" as const },
  { id: "8", amount: 13879.9, type: "income" as const },
  { id: "9", amount: 22223.42, type: "income" as const },
];

function App() {
  const [selectedTab, setSelectedTab] = useQueryState("selectedTab", {
    defaultValue: "all",
  });

  const [transactions, setTransactions] = useState(initialTransactions);
  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "entries") return transaction.type === "income";
    if (selectedTab === "withdrawals") return transaction.type === "expense";
    if (selectedTab === "deleted") return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full px-4 py-6 sm:py-10 max-w-screen-lg mx-auto">
        <Logo />
        <TransactionDialog
          trigger={<Button variant="brand">Novo valor</Button>}
          mode="add"
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
              <span className="ml-2">Todos</span>
            </Button>
            <Button
              state={selectedTab === "entries" ? "active" : "inactive"}
              onClick={() => setSelectedTab("entries")}
              className="w-full sm:w-auto"
            >
              <DownloadIcon />
              <span className="ml-2">Entradas</span>
            </Button>
            <Button
              state={selectedTab === "withdrawals" ? "active" : "inactive"}
              onClick={() => setSelectedTab("withdrawals")}
              className="w-full sm:w-auto"
            >
              <UploadIcon />
              <span className="ml-2">Saídas</span>
            </Button>
          </div>
          <Button
            state={selectedTab === "deleted" ? "active" : "inactive"}
            onClick={() => setSelectedTab("deleted")}
            className="w-full sm:w-auto"
          >
            <TrashIcon />
            <span className="ml-2">Excluídos</span>
          </Button>
        </div>

        <TransactionTable
          transactions={filteredTransactions}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
