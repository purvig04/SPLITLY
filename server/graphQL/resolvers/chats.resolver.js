export const chatResolvers = {
  Query: {
    getChats: async (_, { group_id }, { prisma, user }) => {
      const chats = await prisma.chats.findMany({
        where: {
          groupId: group_id,
        },
      });
      return chats;
    },
  },

  Mutation: {
    sendChat: async (_, {group_id, chatMessage}, { prisma, user }) => {
      const chat = await prisma.chats.create({
        data: {
          groupId: group_id,
          chatMessage,
          senderId: user.id 
        }
      })

      return chat
    } 
  }
};
