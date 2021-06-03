import { Query, Resolver } from "type-graphql";


@Resolver()
export class FirstResolver {
  @Query(()=> String)
  hello(){
    return "hello world!"
  }
}