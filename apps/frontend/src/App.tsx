import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { DashboardIcon, PlusIcon } from "@radix-ui/react-icons";
import { TransactionDialog } from "./components/transaction-dialog";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <Logo />
      <div className="flex gap-8 mb-8">
        <a
          href="https://vite.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img src={viteLogo} className="h-24 w-24" alt="Vite logo" />
        </a>
        <a
          href="https://react.dev"
          target="_blank"
          className="hover:scale-110 transition-transform"
        >
          <img
            src={reactLogo}
            className="h-24 w-24 animate-spin-slow"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-8">Vite + React</h1>

      <div className="flex bg-foreground/5 text-card-foreground p-6 rounded-lg shadow-md mb-8 w-full max-w-md">
        <div className="flex flex-col items-center w-full justify-center gap-2">
          <Button>text</Button>
          <Button>
            <DashboardIcon />
            text
          </Button>
          <Button variant="brand">text</Button>
          <Button variant="icon">
            <DashboardIcon />
          </Button>
          <Button variant="icon-destructive">
            <DashboardIcon />
          </Button>
          <Button state="active">active default</Button>
          <Button state="active" variant="icon">
            1
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center mb-8">
        <TransactionDialog
          trigger={
            <Button variant="brand">
              {" "}
              <PlusIcon className="mr-2" /> Nova Transação (Sucesso)
            </Button>
          }
          mode="add"
        />
        <TransactionDialog
          trigger={<Button>Nova Transação (Erro)</Button>}
          mode="add"
          showError={true}
        />
        <TransactionDialog
          trigger={<Button variant="outline">Editar Transação</Button>}
          mode="edit"
          initialValue="120.44"
          initialType="deposit"
        />
      </div>

      <p className="text-sm text-neutral-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
