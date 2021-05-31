import { Role } from "../types/Role";
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => String)
  @Index()
  @Column("varchar", { unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => String)
  @Column({ default: Role.USER })
  role: string;

  @Column("text", { nullable: true })
  sessionId: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
