import { Ctx, Field, ObjectType } from "type-graphql";
import { ApolloError } from "apollo-server-express";
import { compare, hash } from "bcryptjs";
import { MYSession } from "../middlewares";
import { Cart, Authorization } from "./";
import { OnError } from "../errors";
import { MyContext, Role, ValidatorSchema } from "../types";
import { UserBaseServices } from "../services/user";
import { InputValidator, myValidator } from "../utils/validators";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  OTP_Response,
  OTP_Status,
} from "../services/user/types/responses.types";

@ObjectType()
@Entity("users")
export class User extends BaseEntity implements InputValidator {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => String)
  @Index()
  @Column("varchar", { unique: true })
  email: string;

  @Field()
  @Index()
  @Column("bigint", { unique: true })
  phoneNo: number;

  @Column()
  password: string;

  @Field(() => Role, { defaultValue: Role.USER })
  @Column({ default: Role.USER })
  role: Role;

  @Column()
  @Index()
  refresh_token: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  authorizationId: string;

  @Field(() => Authorization, { nullable: true })
  @OneToOne(() => Authorization, (auth) => auth.user, {
    onDelete: "CASCADE",
    cascade: true,
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  authorization?: Authorization;

  @Field(() => Cart)
  async cart(@Ctx() { req }: MyContext) {
    return await Cart.findOne({
      where: {
        id: req.session.cartId,
      },
      relations: ["cartItems"],
    });
  }

  @BeforeInsert()
  setRefreshToken() {
    this.refresh_token = MYSession.createRefreshToken({ userId: this.id });
  }

  @BeforeInsert()
  normalizeEmail() {
    this.email = this.email.toLowerCase().normalize();
    return this;
  }

  /// functionssss

  private OTP: number | undefined;
  private errors: { [key: string]: string[] } = {};
  private inputErrors: { [key: string]: string[] } | undefined = undefined;
  private uniquenessErrors: boolean = false;
  private uniquePhoneErrors: boolean = false;
  private uniqueEmailErrors: boolean = false;
  private authorizationErrors: boolean = false;
  private newPassword: string;

  setOTP(OTP: number) {
    this.OTP = OTP;
    return this;
  }
  validateInput = async (schema: ValidatorSchema) => {
    this.newPassword;
    this.inputErrors = await myValidator<User>(schema, this);
    this.errors = Object.assign(this.errors, this.inputErrors);

    return this;
  };

  async validateUniqueness(exception?: { user: User }) {
    await this.validateUniqueEmail(exception);
    await this.validateUniquePhoneNo(exception);

    return this;
  }

  getErrors = <T>(errorClass?: { new (): T }): T | OnError | undefined => {
    if (
      this.uniquenessErrors ||
      this.inputErrors ||
      this.uniquePhoneErrors ||
      this.uniqueEmailErrors ||
      this.authorizationErrors
    )
      return Object.assign(
        errorClass ? new errorClass() : new OnError(),
        this.errors
      );

    return undefined;
  };

  //auth function returns user if valid auth or undefined on invalid credentials
  auth = async (
    options: { validateOTP: boolean } = { validateOTP: false }
  ): Promise<User | undefined> => {
    if (options.validateOTP) {
      if (!this.OTP) return undefined;
      const errors = await UserBaseServices.getOtpRequestErrors(
        this.phoneNo,
        this.OTP
      );
      if (errors) return undefined;
    }
    this.normalizeEmail();
    const user = await User.findOne({
      where: { email: this.email },
    });

    if (!user) return undefined;

    const verified = await compare(this.password, user.password);
    if (!verified) return undefined;

    return user;
  };

  sendOTP = async (): Promise<OTP_Status> => {
    if (!this.phoneNo)
      throw new ApolloError(
        "No phoneNo. is provided",
        "phoneNo. is missing_MISSING"
      );
    return UserBaseServices.otpRequest(this.phoneNo);
  };

  getOtpRequestErrors = async (
    phoneNo: number = this.phoneNo
  ): Promise<OTP_Response | undefined> => {
    if (!this.OTP) throw new ApolloError("No OTP is provided", "OTP_MISSING");
    if (!phoneNo)
      throw new ApolloError(
        "No phoneNo. is provided",
        "phoneNo. is missing_MISSING"
      );
    return UserBaseServices.getOtpRequestErrors(phoneNo, this.OTP);
  };

  // hashes password and save
  async register() {
    this.password = await hash(this.password, 12);
    return this.save();
  }

  setNewPassword(newPassword: string) {
    this.newPassword = newPassword;
    return this;
  }

  async isPasswordMatch(userPassword: string) {
    return await compare(this.password, userPassword);
  }

  async validateUniquePhoneNo(exception?: { user: User }) {
    if (
      !exception ||
      (exception &&
        exception.user.phoneNo.toString() !== this.phoneNo.toString())
    ) {
      const user = await User.findOne({ where: { phoneNo: this.phoneNo } });
      if (user) {
        this.uniquePhoneErrors = true;
        this.pushError({
          key: "phoneNo",
          message: "Phone No. already exists.",
        });
      }
    }
    return this;
  }

  async validateUniqueEmail(exception?: { user: User }) {
    if (!exception || (exception && exception.user.email !== this.email)) {
      const user = await User.findOne({ where: { email: this.email } });
      if (user) {
        this.uniqueEmailErrors = true;
        this.pushError({
          key: "email",
          message: "Email already exists.",
        });
      }
    }
    return this;
  }

  validateAuthorization() {
    let authObject: { [key: string]: boolean } = {};
    authObject = Object.assign(authObject, this.authorization);
    const authKeys = Object.keys(authObject).filter(
      (key: string) => authObject[key] !== false
    );
    if (authKeys.length > 0 && this.role === Role.USER) {
      this.authorizationErrors = true;
      this.pushError({
        key: "role",
        message: "USER Role can't have authorizations.",
      });
    }
    return this;
  }

  private pushError({ key, message }: { key: string; message: string }) {
    if (key in this.errors) {
      this.errors[key].push(message);
    } else {
      this.errors[key] = [message];
    }
  }

  resetPassword = async (newPassword: string) => {
    this.password = newPassword;

    this.setRefreshToken();
    // hash passwords and saves
    await this.register();
  };
}
