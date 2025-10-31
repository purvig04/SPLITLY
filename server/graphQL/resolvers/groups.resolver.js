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

    getGroupDetails(_, { id }, { prisma, user }) {
      if (!user) {
        throw new Error("Authentication required");
      }
      return prisma.group.findUnique({
        where: { id: String(id) },
        include: {
          members: { include: { user: true } },
        },
      });
    },
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

    async addMemberToGroup(_, { groupId, emails }, { prisma }) {
      const added = [];
      const invited = [];
      const alreadyMembers = [];

      for (const email of emails) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          invited.push(email);
          continue;
        }

        const existing = await prisma.groupMember.findFirst({
          where: { groupId, userId: user.id },
        });

        if (existing) {
          alreadyMembers.push(email);
          continue;
        }

        await prisma.groupMember.create({
          data: {
            groupId,
            userId: user.id,
          },
        });

        added.push(email);
      }

      const updatedGroup = await prisma.group.findUnique({
        where: { id: groupId },

        include: {
          members: { include: { user: true } },
        },
      });
      return { added, invited, alreadyMembers, updatedGroup };
    },
    
    async renameGroup (_,{groupId , title},{prisma}){
      return prisma.group.update({
        where:{id:groupId},
        data:{title},
        include:{members:{include:{user:true}}}
      })
    },

    async deleteGroup(_,{groupId},{prisma}){
      const deletedG=await prisma.group.delete({
        where:{id:groupId}
      })
      return !!deletedG
    }
  },
};
