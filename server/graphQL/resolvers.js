import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();
import cookieParser from "cookie-parser";
import "dotenv/config";


export const resolvers = {
  Query: {
    //to get single user from backend 
    getUser(_, args,context) {
      if (!context.user){
        throw new Error("Not authenticated");
      }
      return context.user
    },
  },

  Mutation:{
    async register(parent,{name,email,password,contact},context){
        const {res} =context;
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
          data: { name, email, password: hashedPassword, contact },
        });
        const token = jwt.sign({userId: user.id} , process.env.JWT_SECRET );
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 2,
        });
        return {token,user}
    },

    async login (parent,{email,password}){
        const user = await prisma.user.findUnique({where : {email}})
        if(!user){
            throw new Error("Invalid email");
        }
        const valid = await bcrypt.compare(password , user.password)
        if(!valid){
            throw new Error("Inavlid Password");
        }
        const token = jwt.sign({userId: user.id} , process.env.JWT_SECRET);
        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 2,
        });
        return {token,user}
    }
  }
};