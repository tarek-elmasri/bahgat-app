import { OnError } from "../..//errors";
import { ValidatorSchema } from "../..//types";
import { InputValidator, myValidator } from "../../utils/validators";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  OneToMany,
  //OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../User";
import { OrderItem } from "./OrderItem";
//import { OrderItem } from "./OrderItem";

export enum PaymentMethod {
  Cash = "Cash",
  Visa = "Visa Card",
  CreditCard = "Credit Card",
  Mada = "Mada",
}

registerEnumType(PaymentMethod, {
  name: "paymentMethod",
  description: "Order Payment Options",
});

export enum OrderStatus {
  Preparation = "Preparation",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Canceled = "Canceled",
}
registerEnumType(OrderStatus, {
  name: "OrderStatus",
  description: "describe order stages",
});

export enum PaymentStatus {
  Pending = "Pending",
  Canceled = "Canceled",
  Recieved = "Recieved",
}

registerEnumType(PaymentStatus, {
  name: "Payment Status",
  description: "describe whether order funds recieved or not",
});

@ObjectType()
@Entity("orders")
export class Order extends BaseEntity implements InputValidator {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { nullable: true })
  userId?: string;

  @Field()
  @Column("bigint")
  @Index()
  phoneNo: number;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column("text")
  address: string;

  @Field()
  @Column()
  street: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  comments?: string;

  @Field(() => OrderStatus, { defaultValue: OrderStatus.Preparation })
  @Column("enum", { enum: OrderStatus, default: OrderStatus.Preparation })
  status: OrderStatus;

  @Field(() => PaymentMethod)
  @Column("enum", { enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column("enum", { enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  @Index()
  paymentIntentId?: string;

  @Field(() => [OrderItem])
  @OneToMany(() => OrderItem, (item) => item.order, {
    eager: true,
    onDelete: "CASCADE",
    cascade: true,
  })
  orderItems: OrderItem[];

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.orders)
  @JoinTable({ name: "userId" })
  user?: Promise<User>;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  //functions
  private errors: { [key: string]: string[] } = {};
  private inputErrors: { [key: string]: string[] } | undefined = undefined;
  async validateInput(schema: ValidatorSchema) {
    this.inputErrors = await myValidator<Order>(schema, this);
    this.errors = Object.assign(this.errors, this.inputErrors);
    console.log("input errors: ", this.inputErrors);
    console.log("errors", this.errors);
    return this;
  }

  getErrors = <T>(errorClass?: { new (): T }): T | OnError | undefined => {
    if (this.inputErrors)
      return Object.assign(
        errorClass ? new errorClass() : new OnError(),
        this.errors
      );

    return undefined;
  };

  extractStrings() {
    this.city = this.stringExtractor(this.city);
    this.address = this.stringExtractor(this.address);
    this.street = this.stringExtractor(this.street);
    this.comments
      ? (this.comments = this.stringExtractor(this.comments))
      : null;
  }

  private stringExtractor = (data: string): string => {
    let extractedString = "";

    const splitter = data.match(/\w+/g);
    splitter?.forEach(
      (word) => (extractedString = extractedString + " " + word)
    );

    return extractedString.trim();
  };
}
