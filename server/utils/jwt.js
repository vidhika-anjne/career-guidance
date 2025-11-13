import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
