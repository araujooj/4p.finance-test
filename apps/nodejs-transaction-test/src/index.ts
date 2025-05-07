import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Default Vite dev server port
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
