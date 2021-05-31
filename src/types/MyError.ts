import { Field, ObjectType } from "type-graphql"

@ObjectType()
export class MyError {
  @Field(()=> String , {nullable: true})
  field?: string | undefined

  @Field(()=> String, { nullable: true})
  message?: string | undefined

  @Field(()=> String,{nullable: true})
  code?: string | undefined
}