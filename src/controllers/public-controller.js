import { findUserByUsername, registerQuery } from "../models/public-query.js";
import {
  registerSchema,
  loginSchema,
} from "../validations/public-validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerController = async (req, res) => {
  try {
    const result = registerSchema.validate(req.body);
    console.log(result.value);

    if (result.error) {
      return res
        .status(400)
        .json({ error: result.error.details.map((detail) => detail.message) });
    }

    const { first_name, last_name, username, password } = result.value;

    const existingUsername = await findUserByUsername(username);
    console.log(existingUsername);

    if (existingUsername.length > 0) {
      return res.status(400).json({ error: "Username sudah terpakai" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    await registerQuery({
      first_name,
      last_name,
      username,
      hashedPassword,
    });

    res.status(200).json({ message: "Register berhasil" });
  } catch (error) {
    return res.status(500).json({ error: "terjadi kesalahan server", error });
  }
};

export const loginController = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((detail) => detail.message) });
    }

    const { username, password } = value;
    console.log(username, password);

    const [user] = await findUserByUsername(username);
    console.log(user);

    if (!user) {
      return res.status(400).json({ error: "username atau password salah" });
    }

    const isPassword = await bcrypt.compare(password, user.password);

    if (!isPassword) {
      return res.status(400).json({ error: "username atau password salah" });
    }

    const token = jwt.sign({ id: user.id }, process.env.TOKEN, {
      expiresIn: "3d",
    });

    res.json({ message: "login berhasil", token });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "terjadi kesalahan server", message: error.message });
  }
};
