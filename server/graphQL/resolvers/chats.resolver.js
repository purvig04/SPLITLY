import { pubsub } from "../../src/pubsub.js";

export const chatResolvers = {
  Query: {
    getChats: async (_, { group_id }, { prisma }) => {
      const chats = await prisma.chats.findMany({
        where: {
          groupId: group_id,
        },
        orderBy: { createdAt: "asc" },
      });
      return chats;
    },
  },

  Mutation: {
    sendChat: async (_, { group_id, chatMessage }, { prisma, user }) => {
      const chat = await prisma.chats.create({
        data: {
          groupId: group_id,
          chatMessage,
          senderId: user.id,
        },
      });

      await pubsub.publish(`MESSAGE_SENT_${group_id}`, {
        messageAdded: chat,
      });

      return chat;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: (_, { group_id }) => {
        console.log("Subscribing with pubsub", !!pubsub);

        return pubsub.asyncIterableIterator([`MESSAGE_SENT_${group_id}`]);
      },
    },
  },
};
