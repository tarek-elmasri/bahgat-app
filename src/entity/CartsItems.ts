import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Item } from "./Item";

@Entity("cartsitems")
@ObjectType()
export class CartsItems extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  //TODO delete unneccessry fields
  //@Field()
  @Column()
  cartUuid: string;

  //@Field()
  @Column()
  itemUuid: string;

  @Field(() => Int)
  @Column("int")
  quantity: number;

  @Field(() => Item)
  @ManyToOne(() => Item, (item) => item.cartConnection, { primary: true })
  @JoinTable({ name: "itemUuid" })
  item: Promise<Item>;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { primary: true })
  @JoinTable({ name: "cartUuid" })
  cart: Promise<Cart>;
}
