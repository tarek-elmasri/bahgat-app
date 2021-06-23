import { MyContext } from "../types";
import { Ctx, Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Cart, Authorization } from "./";
import { createRefreshToken } from "../middlewares";

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
  @Column({ default: "USER" })
  role: string;

  @Field()
  @Column()
  @Index()
  refresh_token: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  authorizationId: string;

  @Field(() => Authorization, { nullable: true })
  @OneToOne(() => Authorization, (auth) => auth.user, {
    onDelete: "CASCADE",
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  authorization?: Authorization;

  @Field(() => Cart)
  async cart(@Ctx() { req }: MyContext) {
    return await Cart.findOne({
      where: {
        uuid: req.session.cartUuid,
      },
      relations: ["cartItems"],
    });
  }

  @BeforeInsert()
  setRefreshToken() {
    this.refresh_token = createRefreshToken({ userUuid: this.uuid });
  }
}
