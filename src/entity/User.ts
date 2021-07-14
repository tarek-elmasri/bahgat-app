import { MyContext, Role } from "../types";
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
  createLoginSchema,
  createRegistrationSchema,
  loginSchema,
  myValidator,
  registerSchema,
  updateMeSchema,
} from "../utils/validators";
import { compare, hash } from "bcryptjs";
import { PhoneVerification } from "./PhoneValidation";
import { ApolloError } from "apollo-server-express";

type CreateRegistrationSchema = typeof createRegistrationSchema;
type RegisterSchema = typeof registerSchema;
type LoginSchema = typeof loginSchema;
type CreateLoginSchema = typeof createLoginSchema;
type UpdateMeSchema = typeof updateMeSchema;
type ValidatorSchema =
  | CreateRegistrationSchema
  | RegisterSchema
  | LoginSchema
  | CreateLoginSchema
  | UpdateMeSchema;

interface OTP_Response {
  code: string;
  message: string;
}

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

  setOTP(OTP: number) {
    this.OTP = OTP;
    return this;
  }
  validateInput = async (schema: ValidatorSchema) => {
    this.uniquenessErrors;
    this.inputErrors = await myValidator(schema, {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      phoneNo: this.phoneNo,
      OTP: this.OTP,
    });
    this.errors = Object.assign(this.errors, this.inputErrors);

    return this;
  };

  async validateUniqueness(exception?: { user: User }) {
    let user: User | undefined;

    const validateEmail = async () => {
      user = await User.findOne({ where: { email: this.email } });
      if (user) {
        this.uniquenessErrors = true;
        if ("email" in this.errors) {
          this.errors["email"].push("Email already exists.");
        } else {
          this.errors["email"] = ["Email already exists."];
        }
      }
    };
    if (!exception || (exception && exception.user.email !== this.email))
      await validateEmail();

    const validatePhone = async () => {
      user = await User.findOne({ where: { phoneNo: this.phoneNo } });
      if (user) {
        this.uniquenessErrors = true;
        if ("phoneNo" in this.errors) {
          this.errors["phoneNo"].push("Phone No. already exists.");
        } else {
          this.errors["phoneNo"] = ["Phone No. already exists."];
        }
      }
    };

    if (
      !exception ||
      (exception &&
        exception.user.phoneNo.toString() !== this.phoneNo.toString())
    )
      await validatePhone();
    return this;
  }

  getErrors = <T>(errorClass: { new (): T }): T | undefined => {
    if (this.uniquenessErrors || this.inputErrors)
      return Object.assign(new errorClass(), this.errors);

    return undefined;
  };

  //auth function

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

  async register() {
    this.password = await hash(this.password, 12);
    return this.save();
  }
}
