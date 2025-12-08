import jwt from "jsonwebtoken";
import { JWTPASSWORD } from "../type";
import { Request, Response, NextFunction } from "express";
import { UUID } from "crypto";

export interface CustomRequest extends Request {
  id?: UUID;
}

export const userMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // 👉 ENV CHECKER — yahi add karna tha
  console.log("ENV JWTPASSWORD =", JWTPASSWORD);

  // 1. Token extract from headers
  const token = req.headers.authorization;
  console.log("token:", token);

  // 2. Token missing
  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  try {
    // 3. JWT verify using env key
    const payload = jwt.verify(token, JWTPASSWORD) as { userId: UUID };

    // 4. Assign user ID to request object
    req.id = payload.userId;

    // 5. Continue to next handler
    next();
  } catch (err) {
    // 6. Token invalid or expired
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
