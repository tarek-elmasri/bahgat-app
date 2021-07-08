import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { isAuthorized } from "../middlewares";
import { Category } from "../entity";
import { ErrCode, Err, OnError } from "../errors";
import {
  NewCategoryInput,
  UpdateCategoryInput,
  DeleteCategoryInput,
  SuccessResponse,
  CategoryResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  UpdateCategoryErrors,
} from "../types";
import {
  categoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => CategoryResponse)
  async category(@Arg("uuid") uuid: string): Promise<CategoryResponse> {
    // validating uuid syntax
    const formErrors = await categoryValidator({ uuid });
    if (formErrors)
      return {
        errors: new OnError("INVALID_UUID_SYNTAX", "iNVALID uUID sYNTAX eRROR"),
      };

    //find category
    const category = await Category.findOne({
      where: { uuid },
      relations: ["items"],
    });
    if (!category)
      return {
        errors: new OnError("NOT_FOUND", "No Category available for this uuid"),
      };

    return { payload: category };
  }

  @Mutation(() => CreateCategoryResponse)
  //@UseMiddleware(isAuthorized(["addCategory"]))
  async createCategory(
    @Arg("input") input: NewCategoryInput
  ): Promise<CreateCategoryResponse> {
    //validating form
    const formErrors = await createCategoryValidator(input);
    if (formErrors) return { errors: formErrors };

    //save and return
    return { payload: await Category.create(input).save() };
  }

  @Mutation(() => UpdateCategoryResponse)
  //@UseMiddleware(isAuthorized(["updateCategory"]))
  async updateCategory(
    @Arg("input") input: UpdateCategoryInput
  ): Promise<UpdateCategoryResponse> {
    //validate form input
    const formErrors = await updateCategoryValidator(input);
    if (formErrors) return { errors: formErrors };

    // chech if category exists
    const exists = await Category.findOne({ where: { uuid: input.uuid } });
    if (!exists)
      return {
        errors: new UpdateCategoryErrors(
          "NOT_FOUND",
          "No Category matches this ID.",
          ["No Category matches this uuid"]
        ),
      };

    //update category
    await getConnection()
      .getRepository(Category)
      .update({ uuid: input.uuid }, input.fields);

    //find and return
    const category = await Category.findOne({ where: { uuid: input.uuid } });

    return { payload: category! };
  }

  @Mutation(() => SuccessResponse)
  @UseMiddleware(isAuthorized(["deleteCategory"]))
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
