import { friendsResolvers } from "./friends.resolver.js";
import { groupResolvers } from "./groups.resolver.js";
import { userResolvers } from "./user.resolver.js";
import { chatResolvers } from "./chats.resolver.js";
import { categoriesResolvers } from "./categories.resolver.js";
import { expensesResolvers } from "./expenses.resolver.js";
import { settlementsResolvers } from "./settlements.resolver.js";
import { cloudinaryResolvers } from "./cloudinary.resolver.js";

export const resolvers = [
  userResolvers,
  groupResolvers,
  friendsResolvers,
  chatResolvers,
  categoriesResolvers,
  expensesResolvers,
  settlementsResolvers,
  cloudinaryResolvers,
];
