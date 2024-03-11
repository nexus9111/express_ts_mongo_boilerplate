import { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { UserService } from "../services/user.service";
import { ChangePassword, IUser } from "../interfaces/user.interface";
import { AuthService } from "../services/auth.service";
import { RequestWithUser } from "../interfaces/auth.interface";
import { HttpException } from "../exeptions/httpExeption";

export class UserController {
  public user = Container.get(UserService);
  public auth = Container.get(AuthService);

  public getUsers = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const findAllUsersData: IUser[] = await this.user.findAllUsersFast();

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.params.id;
      const findOneUserData: IUser = await this.user.findUserById(userId);

      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const createUserData: IUser = await this.user.createUser(userData);

      res.status(201).json(this.user.toSafeUser(createUserData));
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const changePasswordData: ChangePassword = req.body;
      await this.user.changePassword(
        userId,
        changePasswordData.oldPassword,
        changePasswordData.newPassword,
      );

      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.params.id;

      if (req.user.id === userId) {
        await this.user.deleteUser(userId);
        res.status(204).json({});
        return;
      }

      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  };

  public profile = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: IUser = req.user;

      res.status(200).json(this.user.toSafeUser(userData));
    } catch (error) {
      next(error);
    }
  };

  public login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: IUser = req.body;
      const { cookie, findUser } = await this.auth.login(userData);
      res.setHeader("Set-Cookie", [cookie]);
      res.status(200).json(this.user.toSafeUser(findUser));
    } catch (error) {
      next(error);
    }
  };

  public logout = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userData: IUser = req.user;
      await this.auth.logout(userData);

      res.setHeader("Set-Cookie", ["Authorization=; Max-age=0"]);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  };
}
