import jwt from "jsonwebtoken";
import prisma from "../loaders/prisma.js";

export const findUser = async (token) => {
  if (!token) {
    console.log("no token is found");
    return null;
  }

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch (error) {
    console.error("Error verifying the user from jwt:", error);
    return null;
  }
};
