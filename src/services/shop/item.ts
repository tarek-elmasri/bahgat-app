import { Item } from "../../entity";
import { Arg, Query, Resolver } from "type-graphql";
import { uuidSchema } from "../../utils/validators";

@Resolver()
export class ItemServices {
  @Query(() => [Item])
  async items() {
    return await Item.find();
  }

  @Query(() => Item, { nullable: true })
  async item(@Arg("id") id: string): Promise<Item | undefined> {
    const targetItem = await Item.create({ id }).validateInput(uuidSchema);
    if (targetItem.getErrors()) return undefined;

    return await Item.findOne({
      where: { id },
    });
  }
}
