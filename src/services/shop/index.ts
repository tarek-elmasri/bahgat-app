export * from "./cart";
export * from "./category";
export * from "./item";
import { CategoryServices, ItemServices } from "./";

export const shopServices = [CategoryServices, ItemServices];
