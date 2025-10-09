import prisma from "../src/loaders/prisma.js";
import { findUser } from "../src/utils/auth.js";

export const context = async ({ req, res }) => {
  const token = req.cookies.jwt;
  const user = await findUser(token);
  return { prisma, user, res };
};
