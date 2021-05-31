import { MyContext } from "../types/MyContext";
import { AuthChecker } from "type-graphql";


export const authChecker : AuthChecker<MyContext, string>= ({context}, role) => {
  if (role.includes('ADMIN')){
    return true
  }else{

    console.log(context, role)
  }

  return false
}  