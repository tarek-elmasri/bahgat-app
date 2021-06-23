import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Item } from "./";

@Entity("categories")
@ObjectType()
export class Category extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field()
  @Column("varchar", { nullable: false })
  name: string;

  @Field()
  @Column("text")
  description: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Field(() => [Item], { nullable: true })
  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
