import { normalizeEmail } from "../utils";
import { User } from "../entity";
import { LoginInput } from "../types";
import { Err, ErrCode } from "../errors";
import { compare } from "bcryptjs";

export const Login = async (credentials: LoginInput): Promise<User> => {
  const user = await User.findOne({
    where: { email: normalizeEmail(credentials.email) },
  });

  if (!user) throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or password.");

  const verified = compare(credentials.password, user.password);

  if (!verified)
    throw new Err(ErrCode.INVALID_LOGIN, "Invalid Email or Password.");

  return user;
};
