import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  createTransaction,
  deleteTransactionController,
  getDataProfileController,
  getDataTransaction,
  getDataTransactionsDateController,
  getDetailTransactions,
  getTransactionById,
  updateTransactionsById,
} from "../controllers/user-controller.js";

const User = express.Router();

User.use(authMiddleware);

User.get("/dashboard", getDataTransaction);
User.get("/dashboard/profile", getDataProfileController);
User.get(
  "/dashboard/transactions/chart/:type",
  getDataTransactionsDateController
);
User.get("/dashboard/transactions", getDetailTransactions);
User.post("/dashboard/transactions", createTransaction);
User.get("/dashboard/transactions/edit/:id", getTransactionById);
User.patch("/dashboard/transactions/edit/:id", updateTransactionsById);
User.delete("/dashboard/transactions/:id", deleteTransactionController);

export default User;
