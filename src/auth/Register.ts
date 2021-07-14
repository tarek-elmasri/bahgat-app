import { hash } from "bcryptjs";
import { User } from "../entity";
// import { OnError } from "../errors";
import {
  // CreateRegisterationErrors,
  // CreateRegistrationInput,
  // LoginInput,
  // RegisterErrors,
  RegisterInput,
  Role,
} from "../types";

export const Register = async (
  input: Omit<RegisterInput, "OTP">
): Promise<User> => {
  const { username, email, password, phoneNo } = input;
  return User.create({
    username,
    email,
    phoneNo,
    password: await hash(password, 12),
    role: Role.USER,
  }).save();
};

export class Auth {
  // private formErrors: CreateRegisterationErrors | RegisterErrors | OnError;
  // private input: CreateRegistrationInput | RegisterInput | LoginInput;
  // async firstVerificationFactor(input:)
}
