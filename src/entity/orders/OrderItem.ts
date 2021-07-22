import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "./Order";

@ObjectType()
@Entity("order_items")
export class OrderItem extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  orderId: string;

  @Field(() => Int)
  @Column("int")
  quantity: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column("text")
  description: string;

  @Field()
  @Column("float")
  price: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
