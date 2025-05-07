import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { DashboardIcon } from "@radix-ui/react-icons";

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

      <div className="flex bg-foreground text-card-foreground p-6 rounded-lg shadow-md mb-8 w-full max-w-md">
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
          <Button state="active">active</Button>
          <Button state="active" variant="icon">
            1
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
