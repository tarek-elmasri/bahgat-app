import { Field, InputType } from "type-graphql"




@InputType()
export class NewCategoryInput {

  @Field()
  name: string 

  @Field()
  description: string 


}


@InputType()
class UpdateProperties {
  @Field(()=>String , {nullable: true})
  name: string 

  @Field(()=> String , { nullable: true})
  description: string 
}


@InputType()
export class UpdateCategoryInput{

  @Field(()=> String, {nullable:false})
  uuid:string
  
  @Field(()=> UpdateProperties)
  properties: UpdateProperties

}


@InputType()
export class DeleteCategoryInput {

  @Field()
  uuid: string

  @Field(()=> Boolean, {defaultValue: true})
  saveDelete: boolean

}