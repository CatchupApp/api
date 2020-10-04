import { Request, Response, NextFunction } from "express";
import jwt from "express-jwt";

import User from "../models/user";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return [
    jwt({
      secret: process.env.JWT_SECRET || "",
      algorithms: ["HS256"],
      requestProperty: "token",
    })(req, res, async () => {
      const user = await User.findById(req.token?.sub);
      if (!user) return res.status(401).send(); // User not found
      if (req.params.userId && req.params.userId != user.id)
        return res.status(401).send(); // User's ID doesn't correspond to route ID
      req.user = user;
      return next();
    }),
  ];
};
