import { friendsResolvers } from "./friends.resolver.js";
import { groupResolvers } from "./groups.resolver.js";
import { userResolvers } from "./user.resolver.js";

export const resolvers = [userResolvers, groupResolvers, friendsResolvers]