import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { isAuthorized } from "../middlewares";
import { Category } from "../entity";
import { ErrCode, Err } from "../errors";
import {
  NewCategoryInput,
  UpdateCategoryInput,
  DeleteCategoryInput,
  SuccessResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  UpdateCategoryErrors,
} from "../types";
import {
  createCategoryValidator,
  updateCategoryValidator,
  UuidValidator,
} from "../utils/validators";
import { ValidationError } from "apollo-server-express";
import { updateEntity } from "../utils";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("uuid") uuid: string): Promise<Category | undefined> {
    // validating uuid syntax
    const formErrors = await UuidValidator({ uuid });
    if (formErrors) throw new ValidationError("Invalid UUID Syntax.");

    //find category
    const category = await Category.findOne({
      where: { uuid },
      relations: ["items"],
    });

    if (!category) return undefined;

    return category;
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
  @UseMiddleware(isAuthorized(["updateCategory"]))
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
    const category = await updateEntity(
      Category,
      { uuid: input.uuid },
      input.fields
    );

    return { payload: category! };
  }

  // TODO: implement new response structure
  @Mutation(() => SuccessResponse)
  //@UseMiddleware(isAuthorized(["deleteCategory"]))
  async deleteCategory(
    @Arg("input") { uuid, saveDelete }: DeleteCategoryInput
  ): Promise<SuccessResponse> {
    try {
      if (saveDelete) {
        //check if category have any items
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
