import axios from "axios";
import {
  MSEGAT_API_KEY,
  MSEGAT_USERNAME,
  OTP_EXPIRATION_MINS,
  OTP_REQUEST_INTERVAL,
} from "../types";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("phone_verifications")
export class PhoneVerification extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column("bigint", { unique: true })
  @Index()
  phoneNo: number;

  @Field(() => Int)
  @Column("int")
  OTP: number;

  @UpdateDateColumn()
  updatedAt: Date;

  public isShortRequest() {
    return Date.now() - this.updatedAt.getTime() < OTP_REQUEST_INTERVAL; // 1 min;
  }

  public generateOTP = () => {
    this.OTP = Math.floor(Math.random() * (9998 - 1000 + 1)) + 1000;
    return this;
  };

  private isExpired() {
    return Date.now() - this.updatedAt.getTime() > OTP_EXPIRATION_MINS; //10 mins;
  }

  public async sendOTP() {
    // await send this.otp to this.phoneno.
    return axios
      .post("https://www.msegat.com/gw/sendsms.php", this.createOTPRequest())
      .then((res) => ({ code: res.data?.code, message: res.data?.message }));
  }

  private createOTPRequest() {
    return {
      userName: MSEGAT_USERNAME,
      apiKey: MSEGAT_API_KEY,
      numbers: this.phoneNo.toString(),
      userSender: "OTP",
      msgEncoding: "UTF8",
      msg: `Pin Code is: ${this.OTP}`,
    };
  }

  public isValidOTP(OTP: number) {
    //if (this.isShortRequest()) return false;
    if (this.isExpired()) return false;
    if (OTP !== this.OTP) return false;
    return true;
  }
}
