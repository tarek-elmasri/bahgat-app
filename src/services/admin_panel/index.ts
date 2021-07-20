export * from "./user/user";
export * from "./shop/category";

import { UserPanel } from "./user/user";
import { CategoryPanel } from "./";
import { ItemPanel } from "./shop/item";

export const adminServices = [UserPanel, CategoryPanel, ItemPanel];
