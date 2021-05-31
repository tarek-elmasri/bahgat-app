import { Category } from "../entity/Category";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { CategoryResponse } from "../types/CategoryResponse";
import { NewCategoryInput } from "../types/CategoryInputs";
import { UpdateCategoryInput } from "../types/CategoryInputs";
import { DeleteCategoryInput } from "../types/CategoryInputs";
import { getConnection } from "typeorm";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";
import { SuccessResponse } from "../types/successResponse";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find({ relations: ["items"] });
  }

  @Query(() => CategoryResponse)
  async category(@Arg("uuid") uuid: string): Promise<CategoryResponse> {
    try {
      const category = await Category.findOne({
        where: { uuid },
        relations: ["items"],
      });
      if (!category)
        throw new Err(ErrCode.NOT_FOUND, "No Category matches this ID.");

      return { payload: category };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => CategoryResponse)
  async createCategory(
    @Arg("properties") params: NewCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const category: Category = Category.create(params);
      await category.save();
      return {
        payload: category,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => CategoryResponse)
  async updateCategory(
    @Arg("properties") params: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const exists = await Category.findOne({ where: { uuid: params.uuid } });

      if (!exists)
        throw new Err(ErrCode.NOT_FOUND, "No category matches this ID.");

      await getConnection()
        .getRepository(Category)
        .update({ uuid: params.uuid }, params.properties);

      const category = await Category.findOne({ where: { uuid: params.uuid } });

      return {
        payload: category,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  async deleteCategory(
    @Arg("properties") params: DeleteCategoryInput
  ): Promise<SuccessResponse> {
    try {
      if (params.saveDelete) {
        //check if category have any chocolates
      }

      const result = await getConnection()
        .getRepository(Category)
        .delete({ uuid: params.uuid });
      if (result.affected! < 1)
        throw new Err(ErrCode.NOT_FOUND, "No category matched this ID.");

      return { ok: true };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
