import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import express from "express";
import request from "supertest";
import { userRouter } from "../index";
import { userService } from "../../services/userService";

// Mock the userService
vi.mock("../../services/userService", () => ({
  userService: {
    createUser: vi.fn(),
    getUserById: vi.fn(),
    deposit: vi.fn(),
    withdraw: vi.fn(),
    getStatement: vi.fn(),
  },
}));

describe("User Routes", () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/users", userRouter);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 10 };
      //@ts-ignore
      vi.mocked(userService.createUser).mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/users")
        .send({ name: "Test User", initialBalance: 10 });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockUser);
      expect(userService.createUser).toHaveBeenCalledWith({
        name: "Test User",
        initialBalance: 10,
      });
    });

    it("should return validation error for invalid data", async () => {
      const response = await request(app).post("/users").send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Falha na validação dos dados");
    });
  });

  describe("GET /users/:userId", () => {
    it("should return user when found", async () => {
      const mockUser = { id: "123", name: "Test User", balance: 10 };
      //@ts-ignore
      vi.mocked(userService.getUserById).mockResolvedValue(mockUser);

      const response = await request(app).get("/users/123");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(userService.getUserById).toHaveBeenCalledWith("123");
    });

    it("should return 404 when user not found", async () => {
      //@ts-ignore
      vi.mocked(userService.getUserById).mockResolvedValue(null);

      const response = await request(app).get("/users/123");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("POST /users/:userId/deposit", () => {
    it("should process a deposit", async () => {
      const mockResult = {
        id: "tx1",
        userId: "123",
        type: "deposit",
        amount: 5,
        balance: 15,
      };
      //@ts-ignore
      vi.mocked(userService.deposit).mockResolvedValue(mockResult);

      const response = await request(app)
        .post("/users/123/deposit")
        .send({ amount: 5, description: "Test deposit" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(userService.deposit).toHaveBeenCalledWith("123", {
        amount: 5,
        description: "Test deposit",
      });
    });

    it("should return validation error for invalid amount", async () => {
      const response = await request(app)
        .post("/users/123/deposit")
        .send({ amount: -5 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Falha na validação dos dados");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(userService.deposit).mockRejectedValue(
        new Error("User not found")
      );

      const response = await request(app)
        .post("/users/123/deposit")
        .send({ amount: 5 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });

  describe("POST /users/:userId/withdraw", () => {
    it("should process a withdrawal", async () => {
      const mockResult = {
        id: "tx1",
        userId: "123",
        type: "withdrawal",
        amount: 5,
        balance: 5,
      };
      //@ts-ignore
      vi.mocked(userService.withdraw).mockResolvedValue(mockResult);

      const response = await request(app)
        .post("/users/123/withdraw")
        .send({ amount: 5, description: "Test withdrawal" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(userService.withdraw).toHaveBeenCalledWith("123", {
        amount: 5,
        description: "Test withdrawal",
      });
    });

    it("should return 400 when insufficient funds", async () => {
      vi.mocked(userService.withdraw).mockRejectedValue(
        new Error("Insufficient funds")
      );

      const response = await request(app)
        .post("/users/123/withdraw")
        .send({ amount: 50 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Insufficient funds");
    });
  });

  describe("GET /users/:userId/statement", () => {
    it("should return transaction statement", async () => {
      const mockStatement = {
        currentBalance: 15,
        transactions: [
          { id: "tx1", userId: "123", type: "deposit", amount: 10 },
          { id: "tx2", userId: "123", type: "withdrawal", amount: 5 },
        ],
      };
      //@ts-ignore
      vi.mocked(userService.getStatement).mockResolvedValue(mockStatement);

      const response = await request(app).get("/users/123/statement");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockStatement);
      expect(userService.getStatement).toHaveBeenCalledWith("123");
    });

    it("should return 404 when user not found", async () => {
      vi.mocked(userService.getStatement).mockRejectedValue(
        new Error("User not found")
      );

      const response = await request(app).get("/users/123/statement");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
