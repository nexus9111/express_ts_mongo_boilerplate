import userModels from "../models/user.models";
import { compare, hash } from "bcrypt";
import { Service } from "typedi";
import { HttpException } from "../exeptions/httpExeption";
import { SafeUser, IUser } from "../interfaces/user.interface";
import { CreateUserDto } from "../dto/users.dto";

@Service()
export class UserService {
  public async findAllUsersFast(): Promise<IUser[]> {
    const allUser: IUser[] = await userModels
      .find()
      .select("-password -__v -_id")
      .lean();
    return allUser;
  }

  public async findUserById(userId: string): Promise<IUser> {
    const findUser: IUser = await userModels.findOne({ id: userId });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserByEmail(email: string): Promise<IUser> {
    const findUser: IUser = await userModels.findOne({ email: email });
    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<IUser> {
    const findUser: IUser = await userModels.findOne({ email: userData.email });
    if (findUser)
      throw new HttpException(
        409,
        `This email ${userData.email} already exists`,
      );

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: IUser = await userModels.create({
      ...userData,
      password: hashedPassword,
    });
    return createUserData;
  }

  public async updateUser(
    userId: number,
    userData: CreateUserDto,
  ): Promise<IUser> {
    const findUser = await userModels.findOne({ id: userId });
    if (!findUser) throw new HttpException(401, "You don't have permission");

    const hashedPassword = await hash(userData.password, 10);
    const updateUserData = await findUser.updateOne({
      ...userData,
      password: hashedPassword,
    });

    await findUser.save();

    return updateUserData;
  }

  public async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const findUser = await userModels.findOne({ id: userId });
    if (!findUser) throw new HttpException(401, "You don't have permission");

    const isPasswordMatching: boolean = await compare(
      oldPassword,
      findUser.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(409, "Old password is not matching");

    const hashedPassword = await hash(newPassword, 10);
    await findUser.updateOne({ password: hashedPassword });

    await findUser.save();
  }

  public async deleteUser(userId: string): Promise<void> {
    const findUser = await userModels.findOne({ id: userId });
    if (!findUser) throw new HttpException(401, "You don't have permission");

    await userModels.deleteOne({ id: userId });
  }

  public toSafeUser(user: IUser): SafeUser {
    user = user.toObject();

    const keyToBeDeleted = ["password", "__v", "_id"];

    for (const key in user) {
      if (keyToBeDeleted.includes(key)) {
        delete user[key];
      }
    }

    return user;
  }

  public async getUserCount(): Promise<number> {
    return await userModels.countDocuments();
  }
}
