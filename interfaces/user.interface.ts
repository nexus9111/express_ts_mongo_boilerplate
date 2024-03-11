export interface IUser extends Document {
  id: string;
  email: string;
  password: string;
  role: string;
  toObject?: () => IUser;
}

export interface SafeUser {
  id?: string;
  email: string;
  isAdmin?: boolean;
}

export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
}
