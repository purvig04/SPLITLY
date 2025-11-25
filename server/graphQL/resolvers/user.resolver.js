import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../src/loaders/prisma.js";
import "dotenv/config";

export const userResolvers = {
  Query: {
    //to get single user from backend
    getUser(_, __, context) {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return context.user;
    },

    async getUserById(_, { userId }, __) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      return user;
    },

    async checkUserExists(_, { email }, { prisma }) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      return !!user;
    },
  },

  Mutation: {
    async register(_, { name, email, password, contact }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, contact },
      });

      return user;
    },

    async login(_, { email, password }, context) {
      const { res } = context;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid email");
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error("Inavlid Password");
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });
      return { token, user };
    },

    async logout(_, __, context) {
      const { res } = context;
      res.clearCookie("jwt", { httpOnly: true });
      return true;
    },
  },
};
