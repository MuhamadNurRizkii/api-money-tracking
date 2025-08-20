import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/public-controller.js";
const Public = express.Router();

Public.post("/register", registerController);
Public.post("/login", loginController);

Public.get("/dashboard", (req, res) => {
  res.send("Hallo ini halaman dashboard");
});

export default Public;
