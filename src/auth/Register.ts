import { User } from "../entity";
import { RegisterInput, Role } from "../types";
import { hash } from "bcryptjs";

export const Register = async (input: RegisterInput): Promise<User> => {
  const { username, email, password } = input;
  return await User.create({
    username,
    email,
    password: await hash(password, 12),
    role: Role.USER,
  }).save();
};
