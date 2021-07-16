//import { ValidationError } from "apollo-server-express";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Item, Category } from "../entity";
import { ErrCode, Err } from "../errors";
import {
  newItemInput,
  updateItemInput,
  SuccessResponse,
  CreateItemResponse,
  NewItemError,
  UpdateItemErrors,
  UpdateItemResponse,
} from "../types";
import {
  createItemSchema,
  updateItemSchema,
  uuidSchema,
} from "../utils/validators";
//import { isAuthorized } from "../middlewares";
// import {
//   //UuidValidator,
//   createItemValidator,
//   updateItemValidator,
// } from "../utils/validators";

@Resolver()
export class ItemResolver {
  @Query(() => [Item])
  async items() {
    return await Item.find();
  }

  @Query(() => Item, { nullable: true })
  async item(@Arg("id") id: string): Promise<Item | undefined> {
    const targetItem = await Item.create({ id }).validateInput(uuidSchema);
    if (targetItem.getErrors()) return undefined;

    return await Item.findOne({
      where: { id },
    });
  }

  @Mutation(() => CreateItemResponse)
  //@UseMiddleware(isAuthorized(["addItem"]))
  async createItem(
    @Arg("input") input: newItemInput
  ): Promise<CreateItemResponse> {
    const newItem = await Item.create({
      categoryId: input.categoryId,
      ...input.fields,
    }).validateInput(createItemSchema);
    const formErrors = newItem.getErrors(NewItemError);

    if (formErrors) return { errors: formErrors };
    //make sure category for item exists
    const category = await Category.findOne({
      where: { id: input.categoryId },
    });

    if (!category)
      return {
        errors: new NewItemError("NOT_FOUND", "Invalid Category ID.", [
          "No category",
        ]),
      };

    return {
      payload: await newItem.save(),
    };
  }

  @Mutation(() => UpdateItemResponse)
  //@UseMiddleware(isAuthorized(["updateItem"]))
  async updateItem(
    @Arg("input") input: updateItemInput
  ): Promise<UpdateItemResponse> {
    const { id, fields } = input;
    //validating form
    const targetItem = await Item.create({ id, ...fields }).validateInput(
      updateItemSchema
    );
    const formErrors = targetItem.getErrors(UpdateItemErrors);
    if (formErrors) return { errors: formErrors };

    // check if item already exists
    const item = await Item.preload(targetItem);
    if (!item)
      return {
        errors: new UpdateItemErrors("NOT_FOUND", "No Itemf matches this ID.", [
          "No Item matches this ID.",
        ]),
      };

    // changing category ? check category exists
    if (fields.categoryId) {
      const targetCategory = await Category.findOne({
        where: { id: fields.categoryId },
      });
      if (!targetCategory)
        return {
          errors: new UpdateItemErrors(
            "NOT_FOUND",
            "No Category found for Category ID Field.",
            undefined,
            ["Category not found."]
          ),
        };
    }

    return {
      payload: await targetItem.save(),
    };
  }

  @Mutation(() => SuccessResponse)
  //@UseMiddleware(isAuthorized(["deleteItem"]))
  async deleteItem(@Arg("id") id: string): Promise<SuccessResponse> {
    try {
      const deleted = await Item.delete({ id });

      if (deleted.affected! < 1)
        throw new Err(ErrCode.NOT_FOUND, "No Result matches this ID.");

      return {
        ok: true,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
