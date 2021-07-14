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

@Entity("cartsitems")
@ObjectType()
export class CartsItems extends BaseEntity {
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
}
