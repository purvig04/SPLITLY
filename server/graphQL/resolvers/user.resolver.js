import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../../src/loaders/prisma.js";
import {
  generateShareCode,
  verifyShareCode,
} from "../../src/utils/shareCode.js";
import "dotenv/config";

export const userResolvers = {
  Query: {
    //to get single user from backend
    getUser(_, __, { user }) {
      return user || null;
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

    async findUser(_, { input }, { prisma, user }) {
      if (!user) {
        throw new Error("Not Authenticated!");
      }

      const { email, contact, shareCode } = input;

      const provided = [email, contact, shareCode].filter(Boolean);

      if (provided.length < 1 || provided.length > 1) {
        throw new Error("Only one identifier can be provided at a time");
      }

      if (shareCode) {
        const isValid = verifyShareCode(shareCode);
        if (!isValid) throw new Error("Invalid share code");
      }

      let where = {};

      if (email) {
        where.email = email;
      } else if (contact) {
        where.contact = contact;
      } else if (shareCode) {
        where.shareCode = shareCode;
      }

      return await prisma.user.findFirst({ where });
    },
  },

  Mutation: {
    async register(_, { name, email, password, contact }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const shareCode = generateShareCode();
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, contact, shareCode },
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
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 2,
      });
      return { user };
    },

    async logout(_, __, context) {
      const { res } = context;
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      return true;
    },

    async updateUserDetails(_, { input }, { prisma, user }) {
      if (!user?.id) {
        throw new Error("Authentication required.");
      }

      const data = {};

      if (input.name !== undefined) {
        if (input.name === null) {
          throw new Error("Name cannot be null");
        }
        data.name = input.name;
      }

      if (input.contact !== undefined) {
        if (input.contact === null) {
          throw new Error("Contact cannot be null");
        }
        data.contact = input.contact;
      }

      if (input.profilePic !== undefined) {
        data.profilePic = input.profilePic;
      }

      if (input.profilePicVersion !== undefined) {
        data.profilePicVersion = input.profilePicVersion;
      }

      if (Object.keys(data).length === 0) {
        throw new Error("No fields provided to update");
      }

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data,
      });

      return updatedUser;
    },
  },
};
