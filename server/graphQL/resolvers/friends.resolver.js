export const friendsResolvers = {
  Query: {
    getFriends: async (_, __, { prisma, user }) => {
      const groups = await prisma.group.findMany({
        where: {
          OR: [{ type: "GROUP" }, { type: "PERSONAL" }],
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

      const friendsMap = new Map();

      for (const group of groups) {
        if (!group.members || group.members.length === 0) continue;

        for (const member of group.members) {
          if (!member.user || member.user.id === user.id) continue;

          const friend = member.user;
          const key = `${friend.id}-${group.id}`;

          if (!friendsMap.has(key)) {
            friendsMap.set(key, {
              id: friend.id,
              name: friend.name,
              email: friend.email,
              phone: friend.phone_no,
              groupId: group.id,
              groupTitle: group.title,
              groupType: group.type,
            });
          }
        }
      }

      return Array.from(friendsMap.values())
    }
  },
};
