import { NextFunction, Response } from "express";
import { HttpException } from "../exeptions/httpExeption";
import { RequestWithUser } from "../interfaces/auth.interface";
import { ROLES } from "../models/user.models";

export const AdminRoute = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!(req.user.role === ROLES.ADMIN || req.user.role === ROLES.ROOT)) {
      throw new HttpException(401, "You don't have permission");
    }

    next();
  } catch (error) {
    next(error);
  }
};
