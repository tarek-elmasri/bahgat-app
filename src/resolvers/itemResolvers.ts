import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Item, Category } from "../entity";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";
import { getConnection } from "typeorm";
import {
  ItemResponse,
  newItemInput,
  updateItemInput,
  SuccessResponse,
} from "../types";
import { isStaff } from "../middlewares/authorization";
import { createItemRules, myValidator } from "../utils/validators/myValidator";

@Resolver()
export class ItemResolver {
  @Query(() => [Item])
  async items() {
    return await Item.find({ relations: ["category"] });
  }

  @Query(() => ItemResponse, { nullable: true })
  async item(@Arg("uuid") uuid: string): Promise<ItemResponse> {
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

  @Mutation(() => ItemResponse)
  @UseMiddleware(isStaff)
  async createItem(@Arg("input") input: newItemInput): Promise<ItemResponse> {
    try {
      const formErrors = await myValidator(input, createItemRules);
      if (formErrors) return { errors: formErrors };

      const category = await Category.findOne({
        where: { uuid: input.categoryUuid },
      });

      if (!category)
        throw new Err(
          ErrCode.NOT_FOUND,
          "No Category matches this Category ID."
        );

      return {
        payload: await Item.create(input).save(),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => ItemResponse)
  @UseMiddleware(isStaff)
  async updateItem(
    @Arg("input") { uuid, properties }: updateItemInput
  ): Promise<ItemResponse> {
    try {
      const item = await Item.findOne({ where: { uuid } });
      if (!item) throw new Err(ErrCode.NOT_FOUND, "No Item Matches this ID.");

      //matching the required partial fields for validation
      const formInput = { name: properties.name || item.name };
      const formErrors = await myValidator(formInput, createItemRules);
      if (formErrors) return { errors: formErrors };

      await getConnection().getRepository(Item).update({ uuid }, properties);

      const updated = await Item.findOne({
        where: { uuid },
        relations: ["category"],
      });
      return {
        payload: updated,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isStaff)
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
