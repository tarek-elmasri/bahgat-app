import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Item, Category } from "../entity";
import { ErrCode, Err } from "../errors";
import { getConnection } from "typeorm";
import {
  newItemInput,
  updateItemInput,
  SuccessResponse,
  PayloadResponse,
} from "../types";
import { isAuthorized } from "../middlewares";
//import { createItemRules, myValidator } from "../utils/validators/myValidator";

@Resolver()
export class ItemResolver {
  @Query(() => [Item])
  async items() {
    return await Item.find();
  }

  @Query(() => PayloadResponse, { nullable: true })
  async item(@Arg("uuid") uuid: string): Promise<PayloadResponse> {
    try {
      const item = await Item.findOne({
        where: { uuid },
        relations: ["category"],
      });

      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item matches this ID.");

      return {
        payload: item,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => PayloadResponse)
  @UseMiddleware(isAuthorized(["addItem"]))
  async createItem(
    @Arg("input") { categoryUuid, fields }: newItemInput
  ): Promise<PayloadResponse> {
    try {
      // const formErrors = await myValidator(fields, createItemRules);
      // if (formErrors) return { errors: formErrors };

      const category = await Category.findOne({
        where: { uuid: categoryUuid },
      });

      if (!category)
        throw new Err(
          ErrCode.NOT_FOUND,
          "No Category matches this Category ID."
        );

      return {
        payload: await Item.create({ ...fields, categoryUuid }).save(),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => PayloadResponse)
  @UseMiddleware(isAuthorized(["updateItem"]))
  async updateItem(
    @Arg("input") { uuid, fields }: updateItemInput
  ): Promise<PayloadResponse> {
    try {
      const item = await Item.findOne({ where: { uuid } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item Matches this ID.");

      // //matching the required partial fields for validation
      // const formInput = { name: fields.name || item.name };
      // const formErrors = await myValidator(formInput, createItemRules);
      // if (formErrors) return { errors: formErrors };

      await getConnection().getRepository(Item).update({ uuid }, fields);

      const updated = await Item.findOne({
        where: { uuid },
      });
      return {
        payload: updated,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuthorized(["deleteItem"]))
  async deleteItem(@Arg("uuid") uuid: string): Promise<SuccessResponse> {
    try {
      const deleted = await Item.delete({ uuid });

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
