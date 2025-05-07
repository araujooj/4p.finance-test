import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
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
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-md mb-8 w-full max-w-md">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="w-full bg-primary hover:cursor-pointer  text-primary-foreground py-2 px-4 rounded-md mb-4 hover:bg-primary/90 transition-colors"
        >
          count is {count}
        </button>
        <p className="text-muted-foreground">
          Edit{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
            src/App.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
