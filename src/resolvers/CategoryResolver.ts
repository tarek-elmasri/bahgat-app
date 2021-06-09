import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import {
  CategoryResponse,
  NewCategoryInput,
  UpdateCategoryInput,
  DeleteCategoryInput,
  SuccessResponse,
} from "../types";
import { getConnection } from "typeorm";
import { Err } from "../errors/Err";
import { ErrCode } from "../errors/codes";
import { Category } from "../entity";
import { isStaff } from "../middlewares/authorization";
import {
  createCategoryRules,
  myValidator,
} from "../utils/validators/myValidator";

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
  @UseMiddleware(isStaff)
  async createCategory(
    @Arg("input") input: NewCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const formErrors = await myValidator(input, createCategoryRules);
      if (formErrors) return { errors: formErrors };

      return {
        payload: await Category.create(input).save(),
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => CategoryResponse)
  @UseMiddleware(isStaff)
  async updateCategory(
    @Arg("input") { uuid, fields }: UpdateCategoryInput
  ): Promise<CategoryResponse> {
    try {
      const formErrors = await myValidator(fields, createCategoryRules);
      if (formErrors) return { errors: formErrors };

      const exists = await Category.findOne({ where: { uuid } });
      if (!exists)
        throw new Err(ErrCode.NOT_FOUND, "No category matches this ID.");

      await getConnection().getRepository(Category).update({ uuid }, fields);

      const category = await Category.findOne({ where: { uuid } });

      return {
        payload: category,
      };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isStaff)
  async deleteCategory(
    @Arg("input") { uuid, saveDelete }: DeleteCategoryInput
  ): Promise<SuccessResponse> {
    try {
      if (saveDelete) {
        //check if category have any chocolates
      }

      const result = await getConnection()
        .getRepository(Category)
        .delete({ uuid });
      if (result.affected! < 1)
        throw new Err(ErrCode.NOT_FOUND, "No category matched this ID.");

      return { ok: true };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
