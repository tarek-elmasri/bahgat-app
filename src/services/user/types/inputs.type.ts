import { Field, InputType, Int } from "type-graphql";

@InputType()
export class CreateRegistrationInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phoneNo: number;
}

@InputType()
export class RegisterInput extends CreateRegistrationInput {
  @Field(() => Int)
  OTP: number;
}

@InputType()
export class UpdateMeInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;
}

@InputType()
export class CreateLoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phoneNo: number;
}

@InputType()
export class LoginInput extends CreateLoginInput {
  @Field(() => Int)
  OTP: number;
}

@InputType()
export class CreateResetPasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@InputType()
export class ResetPasswordInput extends CreateResetPasswordInput {
  @Field(() => Int)
  OTP: number;
}

@InputType()
export class UpdatePhoneNoInput {
  @Field()
  phoneNo: number;

  @Field(() => Int)
  OTP: number;
}

@InputType()
export class CreateForgetPasswordInput {
  @Field()
  newPassword: string;

  @Field()
  phoneNo: number;
}

@InputType()
export class ForgetPasswordInput extends CreateForgetPasswordInput {
  @Field(() => Int)
  OTP: number;
}
