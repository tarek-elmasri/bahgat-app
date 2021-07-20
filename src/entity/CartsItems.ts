import { InputValidator, myValidator } from "../utils/validators";
import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart, Item } from "./";
import { ValidatorSchema } from "../types";
import { OnError } from "../errors";

@Entity("cartsitems")
@ObjectType()
export class CartsItems extends BaseEntity implements InputValidator {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  //TODO delete unneccessry fields
  //@Field()
  @Column()
  cartId: string;

  //@Field()
  @Column()
  itemId: string;

  @Field(() => Int)
  @Column("int")
  quantity: number;

  @Field(() => Item)
  @ManyToOne(() => Item, (item) => item.cartConnection, { primary: true })
  @JoinTable({ name: "itemId" })
  item: Promise<Item>;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { primary: true })
  @JoinTable({ name: "cartId" })
  cart: Promise<Cart>;

  // functions
  private errors: { [key: string]: string[] } = {};
  private inputErrors: { [key: string]: string[] } | undefined = undefined;
  async validateInput(schema: ValidatorSchema) {
    this.inputErrors = await myValidator<CartsItems>(schema, this);
    this.errors = Object.assign(this.errors, this.inputErrors);
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
}
