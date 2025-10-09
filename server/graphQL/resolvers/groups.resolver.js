export const groupResolvers = {
  Query: {
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
