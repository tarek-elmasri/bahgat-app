import { MyContext, OTP_Response, Role, ValidatorSchema } from "../types";
import { Ctx, Field, ObjectType } from "type-graphql";
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
import { Cart, Authorization } from "./";
import { createRefreshToken } from "../middlewares";
import {
  InputValidator,
  // createLoginSchema,
  // createRegistrationSchema,
  // loginSchema,
  myValidator,
  // registerSchema,
  // updateMeSchema,
} from "../utils/validators";
import { compare, hash } from "bcryptjs";
import { PhoneVerification } from "./PhoneValidation";
import { ApolloError } from "apollo-server-express";
import { OnError } from "../errors";

// type CreateRegistrationSchema = typeof createRegistrationSchema;
// type RegisterSchema = typeof registerSchema;
// type LoginSchema = typeof loginSchema;
// type CreateLoginSchema = typeof createLoginSchema;
// type UpdateMeSchema = typeof updateMeSchema;
// type ValidatorSchema =
//   | CreateRegistrationSchema
//   | RegisterSchema
//   | LoginSchema
//   | CreateLoginSchema
//   | UpdateMeSchema;

// interface OTP_Response {
//   code: string;
//   message: string;
// }

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
    this.refresh_token = createRefreshToken({ userId: this.id });
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
      this.uniqueEmailErrors
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
      const phoneVerification = await PhoneVerification.findOne({
        where: { phoneNo: this.phoneNo },
      });
      if (
        !phoneVerification ||
        !this.OTP ||
        !phoneVerification.isValidOTP(this.OTP)
      )
        return undefined;
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

  sendOTP = async (): Promise<OTP_Response> => {
    //finding user phone verification entity
    const phoneVerification = await PhoneVerification.findOne({
      where: { phoneNo: this.phoneNo },
    });
    if (!phoneVerification)
      throw new ApolloError(
        // user supposed to have phone no.
        "Server can't perform  phone verification at this moment"
      );

    if (phoneVerification.isShortRequest())
      return {
        code: "SHORT_TIME_REQUEST",
        message: "20 second interval is required between OTP requests",
      };

    await phoneVerification.generateOTP().save();

    return phoneVerification.sendOTP();
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
    return compare(this.password, userPassword);
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

  private pushError({ key, message }: { key: string; message: string }) {
    if (key in this.errors) {
      this.errors[key].push(message);
    } else {
      this.errors[key] = [message];
    }
  }
}
