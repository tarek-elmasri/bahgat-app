import { isAuthorized } from "../../../middlewares/authorizations";
import { Arg, Mutation, Resolver } from "type-graphql";
import {
  DeleteCategoryInput,
  NewCategoryInput,
  UpdateCategoryInput,
} from "./types/inputs.type";
import {
  CreateCategoryErrors,
  CreateCategoryResponse,
  DeleteResponse,
  UpdateCategoryErrors,
  UpdateCategoryResponse,
} from "./types/responses.type";
import { Category } from "../../../entity";
import {
  newCategorySchema,
  updateCategorySchema,
  uuidSchema,
} from "../../../utils/validators";
import { OnError } from "../../../errors";

@Resolver()
export class CategoryPanel {
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
  @Mutation(() => DeleteResponse)
  @isAuthorized(["deleteCategory"])
  async deleteCategory(
    @Arg("input") { id, saveDelete }: DeleteCategoryInput
  ): Promise<DeleteResponse> {
    const targetCategory = await Category.create({ id }).validateInput(
      uuidSchema
    );
    if (targetCategory.getErrors())
      return {
        errors: new OnError("INVALID_INPUT_PARAMETERS", "Invalid ID syntax."),
      };

    const category = await Category.preload(targetCategory);
    if (!category)
      return {
        errors: {
          code: "NOT_FOUND",
          message: "No Category found for this ID.",
        },
      };

    if (saveDelete && category.items.length > 0)
      return {
        errors: {
          code: "CASCADE_FAILURE",
          message:
            "Conflict deleting category having items with 'saveDelete' Option.",
        },
      };

    await category.remove();

    return { payload: "Success" };
  }
}
