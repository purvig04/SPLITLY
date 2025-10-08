import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import cookieParser from "cookie-parser";
import "dotenv/config";

export const resolvers = {
  Query: {
    //to get single user from backend
    getUser(_, args, context) {
      if (!context.user) {
        throw new Error("Not authenticated");
      }
      return context.user;
    },

    getGroups(_, __, { prisma, user }) {
      return prisma.group.findMany({
        where: {
          OR: [
            { createdById: user.id },
            { members: { some: { userId: user.id } } },
          ],
        },
        include: {
          members: {
            include: { user: true },
          },
        },
      });
    },
  },

  Mutation: {
    async register(parent, { name, email, password, contact }) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, contact },
      });

      return user;
    },

    async login(parent, { email, password }, context) {
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
        maxAge: 1000 * 60 * 60 * 24 * 1,
      });
      return { token, user };
    },

    async logout(parent, args, context) {
      const { res } = context;
      res.clearCookie("jwt", { httpOnly: true });
      return true;
    },

    async createGroup(_, { title, type, members = [] }, { prisma, user }) {
      const groupType = type || "GROUP";
      const group = await prisma.group.create({
        data: {
          title,
          type: groupType,
          createdById: user.id,
        },
      });
      if (members.length > 0) {
        for (const member of members) {
          let existingUser = null;

          //for now input is email
          existingUser = await prisma.user.findUnique({
            where: { email: member },
          });

          if (existingUser) {
            // User exists so add to group
            await prisma.groupMember.create({
              data: {
                userId: existingUser.id,
                groupId: group.id,
              },
            });
          } else {
            // User not found → send invite
            console.log(`Send invite to ${member}`);
            //will handle this later
          }
        }
      }

      return group;
    },
  },
};
