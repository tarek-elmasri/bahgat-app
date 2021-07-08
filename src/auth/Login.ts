import { normalizeEmail } from "../utils";
import { User } from "../entity";
import { LoginInput } from "../types";
//import { Err, ErrCode } from "../errors";
import { compare } from "bcryptjs";

export const Login = async (
  credentials: LoginInput
): Promise<User | undefined> => {
  const user = await User.findOne({
    where: { email: normalizeEmail(credentials.email) },
  });

  if (!user) return undefined;

  const verified = await compare(credentials.password, user.password);
  if (!verified) return undefined;

  return user;
};
