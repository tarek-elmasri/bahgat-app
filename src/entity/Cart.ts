import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartsItems } from "./CartsItems";

@Entity("carts")
@ObjectType()
export class Cart extends BaseEntity {
  //@Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  // expted not need
  //TODO test
  //@Field(() => String, { nullable: true })
  @Column({ nullable: true })
  userUuid?: string;

  @Column({ nullable: true })
  sessionId: string;

  @Field(() => [CartsItems])
  @OneToMany(() => CartsItems, (cartItem) => cartItem.cart)
  cartItems: Promise<CartsItems[]>;

  //TODO after implementation
  //useless here as quantities are not available --> to be moved into cart items entity
  //supposed to return CartItems
  //@Field(() => [Item], { nullable: true })
  // items(@Ctx() { itemsLoader }: MyContext) {
  //   return itemsLoader.load(this.uuid);
  // }
}
