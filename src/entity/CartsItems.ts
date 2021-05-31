import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import { Item } from "./Item";

@Entity("cartsitems")
@ObjectType()
export class CartsItems extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column()
  cartUuid: string;

  @Field()
  @Column()
  itemUuid: string;

  @Field(() => Int)
  @Column("int")
  quantity: number;

  @Field(() => Item)
  @ManyToOne(() => Item, (item) => item.cartItems, { nullable: true })
  item: Item;

  @Field(() => Cart)
  @ManyToOne(() => Cart, (cart) => cart.cartItems, { nullable: true })
  card: Cart;
}
