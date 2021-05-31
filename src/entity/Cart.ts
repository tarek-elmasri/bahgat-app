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
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  userUuid?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  sessionId: string;

  @Field(() => [CartsItems], { nullable: true })
  @OneToMany(() => CartsItems, (cartItem) => cartItem.card)
  cartItems?: CartsItems[];
}
