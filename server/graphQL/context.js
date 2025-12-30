import prisma from "../src/loaders/prisma.js";
import { findUser } from "../src/utils/auth.js";
import { pubsub } from "../src/pubsub.js";

export const context = async ({ req, res }) => {
  const token = req.cookies.jwt;
  const payload = await findUser(token);
  const user = payload
    ? await prisma.user.findUnique({ where: { id: payload.userId } })
    : null;
  return { prisma, user, res, pubsub };
};
