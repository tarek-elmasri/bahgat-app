import { Category } from "../../entity";
import { uuidSchema } from "../../utils/validators";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class CategoryServices {
  @Query(() => [Category])
  async categories(): Promise<Category[]> {
    return await Category.find();
  }

  @Query(() => Category, { nullable: true })
  async category(@Arg("id") id: string): Promise<Category | undefined> {
    const targetCategory = await Category.create({ id }).validateInput(
      uuidSchema
    );
    if (targetCategory.getErrors()) return undefined;
    //find category
    return Category.findOne({
      where: { id },
    });
  }
}
