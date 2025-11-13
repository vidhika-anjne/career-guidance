import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    let token = null;
    if (req.cookies && req.cookies.token) token = req.cookies.token;
    else if (header.startsWith("Bearer ")) token = header.substring(7);
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
}
