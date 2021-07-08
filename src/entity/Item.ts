import { MyContext } from "../types";
import { Ctx, Field, Float, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart, CartsItems, Category } from "./";

@ObjectType()
@Entity("items")
export class Item extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column("varchar")
  name: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  img: string;

  @Field()
  @Column("float")
  price: number;

  //to make this field allowable to null and remove next infinite stock
  @Field(() => Int)
  @Column("int")
  stock: number;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  infiniteStock: boolean;

  @Field()
  @Column("boolean", { default: false })
  notifyLowStock: boolean;

  @Field(() => Int, { nullable: true })
  @Column("int", { nullable: true })
  notifyStockOfQuantity: number;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  patchNo: string;

  @Field(() => String, { nullable: true })
  @Column("varchar", { nullable: true })
  weight: string;

  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  costValue: number;

  @Field(() => Float, { nullable: true })
  @Column("float", { nullable: true })
  discountPrice: number;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  haveDiscount: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  quantityLimitOnDiscount: boolean;

  @Field(() => Int, { nullable: true })
  @Column("int", { nullable: true })
  maxQuantityOnDiscount: number;

  @Field(() => Date, { nullable: true })
  @Column("timestamp", { nullable: true })
  discountEndDate: Date;

  @Field()
  @Column()
  categoryUuid: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: "CASCADE",
  })
  @JoinTable({ name: "categoryUuid" })
  category: Promise<Category>;

  @OneToMany(() => CartsItems, (cartItem) => cartItem.item)
  cartConnection: Promise<CartsItems[]>;

  //useless -> to be deleted
  @Field(() => [Cart], { nullable: true })
  carts(@Ctx() { cartsLoader }: MyContext) {
    return cartsLoader.load(this.uuid);
  }
}
