import { friendsTypeDefs } from "./friends.typeDef.js";
import { groupTypeDefs } from "./groups.typeDef.js";
import { userTypeDefs } from "./user.typeDef.js";
import { chatTypeDefs } from "./chats.typeDef.js";

export const typeDefs = [userTypeDefs, groupTypeDefs, friendsTypeDefs, chatTypeDefs];
