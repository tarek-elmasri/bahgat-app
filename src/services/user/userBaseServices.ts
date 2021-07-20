import { PhoneVerification } from "../../entity";
import { OTP_Status } from "./types/responses.types";

export class UserBaseServices {
  static otpRequest = async (phoneNo: number): Promise<OTP_Status> => {
    let phoneVerification = await PhoneVerification.findOne({
      where: { phoneNo },
    });
    // excluding resend OTP if short intervals between requests.
    if (phoneVerification && phoneVerification.isShortRequest())
      return {
        errors: {
          code: "SHORT_TIME_REQUEST",
          message: "Interval between OTP requests must exceed 20 secsonds.",
        },
      };

    // create phoneVerification for new requests
    if (!phoneVerification) {
      phoneVerification = PhoneVerification.create({
        phoneNo,
      });
    }
    //generating OTP and save or resave model
    await phoneVerification.generateOTP().save();
    // sending otp
    const otpResponse = await phoneVerification.sendOTP();
    if (otpResponse.code !== "1")
      return {
        errors: {
          code: otpResponse.code,
          message: otpResponse.message,
        },
      };
    return {
      payload: {
        message: "OTP is successfully sent to phone no.",
        code: "Success",
      },
    };
  };

  static async getOtpRequestErrors(phoneNo: number, OTP: number) {
    // find the phone verification for otp
    const verifiedPhone = await PhoneVerification.findOne({
      where: { phoneNo },
    });

    if (!verifiedPhone)
      return {
        code: "NOT_FOUND",
        message: "No user found for this phoneNo.",
      };

    // isValidOtp validates OTP match and not expired
    if (!verifiedPhone!.isValidOTP(OTP))
      return {
        code: "INVALID_OTP",
        message: "Expired or Invalid OTP Match.",
      };

    return undefined;
  }
}
