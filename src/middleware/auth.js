import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Akses ditolak. Token tidak ditemukan atau kadaluwarsa",
      });
    }

    const token = authorizationHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.TOKEN);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Token tidak valid atau sudah kadaluwarsa.",
      error: error,
    });
  }
};
