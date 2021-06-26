import { Field, InputType, Int } from "type-graphql";

@InputType()
class newItemFields {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  img: string;

  @Field()
  price: number;

  @Field(() => Int)
  stock: number;

  @Field({ defaultValue: false })
  infiniteStock: boolean;

  @Field({ defaultValue: false })
  notifyLowStock: boolean;

  @Field(() => Int, { nullable: true })
  notifyStockOfQuantity: number;

  @Field(() => String, { nullable: true })
  patchNo: string;

  @Field(() => String, { nullable: true })
  weight: string;

  @Field(() => Int, { nullable: true })
  costValue: number;

  @Field(() => Int, { nullable: true })
  discountPrice: number;

  @Field({ defaultValue: false })
  haveDiscount: boolean;

  @Field({ defaultValue: false })
  quantityLimitOnDiscount: boolean;

  @Field(() => Int, { nullable: true })
  maxQuantityOnDiscount: number;

  @Field(() => Date, { nullable: true })
  discountEndDate: Date;
}

@InputType()
export class newItemInput {
  @Field()
  categoryUuid: string;

  @Field(() => newItemFields)
  fields: newItemFields;
}

@InputType()
class updateItemFields {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  img: string;

  @Field(() => Int, { nullable: true })
  price: number;

  @Field(() => Int, { nullable: true })
  stock: number;

  @Field({ defaultValue: false })
  infiniteStock: boolean;

  @Field({ defaultValue: false })
  notifyLowStock: boolean;

  @Field(() => Int, { nullable: true })
  notifyStockOfQuantity: number;

  @Field(() => String, { nullable: true })
  patchNo: string;

  @Field(() => String, { nullable: true })
  weight: string;

  @Field(() => Int, { nullable: true })
  costValue: number;

  @Field(() => Int, { nullable: true })
  discountPrice: number;

  @Field({ defaultValue: false })
  haveDiscount: boolean;

  @Field({ defaultValue: false })
  quantityLimitOnDiscount: boolean;

  @Field(() => Int, { nullable: true })
  maxQuantityOnDiscount: number;

  @Field(() => Date, { nullable: true })
  discountEndDate: Date;
}
@InputType()
export class updateItemInput {
  @Field(() => String)
  uuid: string;

  @Field(() => updateItemFields)
  fields: updateItemFields;
}
