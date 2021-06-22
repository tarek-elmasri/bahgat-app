import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity("authorizations")
export class Authorization extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.authorization)
  user: User;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  viewAllUsers: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  updateUser: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  deleteUser: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  addItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  updateItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  deleteItem: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  addCategory: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  updateCategory: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @Column("boolean", { default: false })
  deleteCategory: boolean;
}
