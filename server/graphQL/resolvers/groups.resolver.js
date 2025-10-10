export const groupResolvers = {
  Query: {
    getGroups(_, { type }, { prisma, user }) {
      return prisma.group.findMany({
        where: {
          AND: [
            {
              OR: [
                { createdById: user.id },
                { members: { some: { userId: user.id } } },
              ],
            },
            ...(type ? [{ type }] : []),
          ],
        },
        include: {
          members: {
            include: { user: true },
          },
        },
      });
    },

    getGroupDetails (_,{id},{prisma,user}){
      if (!user) {
        throw new Error("Authentication required");
      }
      return prisma.group.findUnique({
        where:{id : String(id)},
        include:{
          members:{include:{user:true}}
        }
      })
    }

  },
  Mutation: {
    async createGroup(_, { title, type, members = [] }, { prisma, user }) {
      if (!user) {
        throw new Error("Authentication required to create a group.");
      }
      const groupType = type || "GROUP";
      const newGroup = await prisma.group.create({
        data: {
          title,
          type: groupType,
          createdById: user.id,
          members: {
            create: {
              userId: user.id,
            },
          },
        },
        include: {
          members: {
            include: { user: true },
          },
        },
      });

   
    
        
      return newGroup;
    },
  },
};
