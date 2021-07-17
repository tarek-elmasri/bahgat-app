import { PhoneVerification, User } from "../../entity";
import { CurrentUser } from "../../middlewares";
import {
  CreateUpdatePhoneNoErrors,
  CreateUpdatePhoneNoResponse,
  MyContext,
  UpdatePhoneNoErrors,
  UpdatePhoneNoInput,
  UpdatePhoneNoResponse,
} from "../../types";
import {
  createUpdatePhoneNoSchema,
  updatePhoneNoSchema,
} from "../../utils/validators";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { UserBaseServices } from "./userBaseServices";

@Resolver()
export class CreateUpdatePhoneNo extends UserBaseServices {
  @Mutation(() => CreateUpdatePhoneNoResponse)
  @CurrentUser()
  async createUpdatePhoneNo(
    @Arg("newPhoneNo") phoneNo: number,
    @Ctx() { req }: MyContext
  ): Promise<CreateUpdatePhoneNoResponse> {
    const user = await User.create({ phoneNo }).validateInput(
      createUpdatePhoneNoSchema
    );

    if (phoneNo.toString() === req.user!.phoneNo.toString())
      return {
        errors: {
          code: "SAME_VALUE",
          message: "PhoneNo matches current value",
        },
      };
    const errors = (
      await user.validateUniquePhoneNo({ user: req.user! })
    ).getErrors(CreateUpdatePhoneNoErrors);
    if (errors) return { errors };

    const response = await this.otpRequest(phoneNo);
    if (response.errors)
      return {
        errors: {
          code: response.errors.code,
          message: response.errors.message,
        },
      };

    return { payload: response.payload };
  }

  @Mutation(() => UpdatePhoneNoResponse)
  @CurrentUser()
  async updatePhoneNo(
    @Arg("input") { phoneNo, OTP }: UpdatePhoneNoInput,
    @Ctx() { req }: MyContext
  ): Promise<UpdatePhoneNoResponse> {
    const userAttempt = User.create({ phoneNo }).setOTP(OTP);
    await userAttempt.validateInput(updatePhoneNoSchema);

    if (phoneNo.toString() === req.user!.phoneNo.toString())
      return {
        errors: {
          code: "SAME_VALUE",
          message: "PhoneNo matches current value",
        },
      };

    await userAttempt.validateUniquePhoneNo({ user: req.user! });
    const errors = userAttempt.getErrors(UpdatePhoneNoErrors);
    if (errors) return { errors };

    const verifiedPhone = await PhoneVerification.findOne({
      where: { phoneNo },
    });
    if (!verifiedPhone)
      return {
        errors: {
          code: "PHONE_NOT_VERIFIED",
          message: "Phone not verified, Call 'createUpdatePhoneNo' first.",
        },
      };

    if (!verifiedPhone.isValidOTP(OTP))
      return {
        errors: new UpdatePhoneNoErrors(
          "INVALID_OTP",
          "Invalid OTP match.",
          undefined,
          ["Invalid OTP match."]
        ),
      };

    req.user!.phoneNo = phoneNo;
    await req.user!.save();

    return {
      payload: {
        code: "Success",
        message: "User phoneNo updated successfully.",
      },
    };
  }
}
