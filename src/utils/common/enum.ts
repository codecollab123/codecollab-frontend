// we are going to use snake case with all capitals
// to use this import the object like here=>
//  import {Admin_Schema_Prompt_Messages} from "...path/common/enum"
// if (!user.firstName) {
//     errors.push(Admin_Schema_Prompt_Messages.FIRST_NAME_REQUIRED);
// }

export enum Api_Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}
export enum USER_NOTIFICATION_TYPE {
  POST_LIKED = "POST_LIKED",
  POST_COMMENTED = "POST_COMMENTED",
  SOLUTION_SUBMITTED = "SOLUTION_SUBMITTED",
  SOLUTION_ACCEPTED = "SOLUTION_ACCEPTED",
  FOLLOWED_YOU = "FOLLOWED_YOU",
  SYSTEM_UPDATE = "SYSTEM_UPDATE",
}

export enum NOTIFICATION_ENTITY {
  POST = "POST",
  COMMENT = "COMMENT",
  SOLUTION = "SOLUTION",
  USER = "USER",
  SYSTEM = "SYSTEM",
}

export enum NOTIFICATION_STATUS {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface USER_NOTIFICATION {
  id: string;
  message: string;
  type: USER_NOTIFICATION_TYPE;
  entity: NOTIFICATION_ENTITY;
  path: string;
  user_id: string;
}