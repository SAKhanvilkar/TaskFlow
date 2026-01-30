import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../models/user.model";
import jwt from 'jsonwebtoken'


// Extend the Express Request type to include the user
interface AuthRequest extends Request {
    user?: IUserDocument | null;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log("authHeader",authHeader);
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
};

