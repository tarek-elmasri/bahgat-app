import { InputValidator, myValidator } from "../utils/validators";
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
import { ValidatorSchema } from "../types";
import { OnError } from "../errors";

@Entity("categories")
@ObjectType()
export class Category extends BaseEntity implements InputValidator {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
  @OneToMany(() => Item, (item) => item.category, { eager: true })
  items: Item[];

  // functions
  private errors: { [key: string]: string[] } = {};
  private inputErrors: { [key: string]: string[] } | undefined = undefined;
  async validateInput(schema: ValidatorSchema) {
    this.inputErrors = await myValidator(schema, {
      id: this.id,
      name: this.name,
      description: this.description,
    });
    this.errors = Object.assign(this.errors, this.inputErrors);
    console.log("input errors: ", this.inputErrors);
    console.log("errors", this.errors);
    return this;
  }

  getErrors = <T>(errorClass?: { new (): T }): T | OnError | undefined => {
    if (this.inputErrors)
      return Object.assign(
        errorClass ? new errorClass() : new OnError(),
        this.errors
      );

    return undefined;
  };
}
