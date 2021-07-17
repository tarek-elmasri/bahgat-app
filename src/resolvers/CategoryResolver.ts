import { isAuthorized } from "../middlewares";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { Category } from "../entity";
import { ErrCode, Err, InvalidUuidSyntaxError } from "../errors";
import {
  NewCategoryInput,
  UpdateCategoryInput,
  DeleteCategoryInput,
  SuccessResponse,
  CreateCategoryResponse,
  UpdateCategoryResponse,
  UpdateCategoryErrors,
  CreateCategoryErrors,
} from "../types";
import {
  newCategorySchema,
  updateCategorySchema,
  uuidSchema,
} from "../utils/validators";

@Resolver()
export class CategoryResolver {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id") id: string): Promise<Category | undefined> {
    const formErrors = (
      await Category.create({ id }).validateInput(uuidSchema)
    ).getErrors(InvalidUuidSyntaxError);
    if (formErrors) return undefined;
    //find category
    return Category.findOne({
      where: { id },
    });
  }

  @Mutation(() => CreateCategoryResponse)
  @isAuthorized(["addCategory"])
  async createCategory(
    @Arg("input") input: NewCategoryInput
  ): Promise<CreateCategoryResponse> {
    const newCategory = Category.create(input);
    await newCategory.validateInput(newCategorySchema);
    const formErrors = newCategory.getErrors(CreateCategoryErrors);
    if (formErrors) return { errors: formErrors };

    //save and return
    return { payload: await newCategory.save() };
  }

  @Mutation(() => UpdateCategoryResponse)
  @isAuthorized(["updateCategory"])
  async updateCategory(
    @Arg("input") input: UpdateCategoryInput
  ): Promise<UpdateCategoryResponse> {
    //validate form input
    const targetCategory = Category.create({ id: input.id, ...input.fields });
    await targetCategory.validateInput(updateCategorySchema);
    const formErrors = targetCategory.getErrors(UpdateCategoryErrors);
    if (formErrors) return { errors: formErrors };

    const category = await Category.preload(targetCategory);
    if (!category)
      return {
        errors: new UpdateCategoryErrors(
          "NOT_FOUND",
          "No Category matches this ID.",
          ["No Category matches this ID."]
        ),
      };

    //save and return
    return { payload: await category.save() };
  }

  // TODO: implement new response structure
  @Mutation(() => SuccessResponse)
  @isAuthorized(["deleteCategory"])
  async deleteCategory(
    @Arg("input") { id, saveDelete }: DeleteCategoryInput
  ): Promise<SuccessResponse> {
    try {
      if (saveDelete) {
        //check if category have any items
      }

      const result = await getConnection()
        .getRepository(Category)
        .delete({ id });
      if (result.affected! < 1)
        throw new Err(ErrCode.NOT_FOUND, "No category matched this ID.");

      return { ok: true };
    } catch (err) {
      return Err.ResponseBuilder(err);
    }
  }
}
