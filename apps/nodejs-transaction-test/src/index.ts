import express from "express";
import * as dotenv from "dotenv";
import { userRouter } from "./routes";

dotenv.config({ path: ".env.local" });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
