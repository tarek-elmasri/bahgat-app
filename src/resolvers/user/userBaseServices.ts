import { PhoneVerification } from "../../entity";
import { OTP_Response } from "../../types";

interface OTP_Status {
  payload?: OTP_Response;
  errors?: { code: string; message: string };
}
export class UserBaseServices {
  protected otpRequest = async (phoneNo: number): Promise<OTP_Status> => {
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
}
