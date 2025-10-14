export const friendsResolvers = {
  Query: {
    getPersonalGroups: async (_, __, { prisma, user }) => {
      const groups = await prisma.group.findMany({
        where: {
          type: "PERSONAL",
          members: { some: { userId: user.id } },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      });

      return groups.map((group) => {
        const friend = group.members.find((m) => m.user.id !== user.id)?.user;

        if(!friend) return null

        return {
          id: friend.id,
          name: friend.name,
          email: friend.email,
          phone: friend.phone_no,
          groupTitle: group.title,
          groupType: group.type,
        };
      });
    },
  },
};
