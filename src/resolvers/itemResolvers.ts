//import { ValidationError } from "apollo-server-express";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Item, Category } from "../entity";
import { updateEntity } from "../utils";
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
    // const uuidError = await UuidValidator({ id });
    // if (uuidError) throw new ValidationError("Invalid UUID Syntax.");

    const item = await Item.findOne({
      where: { id },
      relations: ["category"],
    });

    return item;
  }

  @Mutation(() => CreateItemResponse)
  //@UseMiddleware(isAuthorized(["addItem"]))
  async createItem(
    @Arg("input") input: newItemInput
  ): Promise<CreateItemResponse> {
    // //validating input form
    // const formErrors = await createItemValidator(input);
    // if (formErrors) return { errors: formErrors };

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
      payload: await Item.create({
        categoryId: input.categoryId,
        ...input.fields,
      }).save(),
    };
  }

  @Mutation(() => UpdateItemResponse)
  //@UseMiddleware(isAuthorized(["updateItem"]))
  async updateItem(
    @Arg("input") input: updateItemInput
  ): Promise<UpdateItemResponse> {
    //validating form
    // const formErrors = await updateItemValidator(input);
    // if (formErrors) return { errors: formErrors };

    const { id, fields } = input;
    // check if item already exists
    const item = await Item.findOne({ where: { id } });
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
    //update
    const updatedItem = await updateEntity(Item, { id }, fields);

    return {
      payload: updatedItem,
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
