import express from "express";
import Public from "./routes/public-route.js";
import cors from "cors";
import User from "./routes/user-route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", Public);
app.use("/api/users", User);

export default app;
