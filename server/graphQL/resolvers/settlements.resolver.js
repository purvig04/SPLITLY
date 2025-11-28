export const settlementsResolvers = {
  Mutation: {
    async createSettlement(_, { input }, { prisma, user }) {
      if (!user) {
        throw new Error("User not authenticated");
      }

     

      const { group_id, payer_id, receiver_id, amount } = input;

       const group = await prisma.group.findUnique({
         where: {id:group_id},
         select :{currentCycleId:true}
       });

        if (!group) throw new Error("Group not found");

      const settlement = await prisma.settlement.create({
        data: {
          group_id,
          payer_id,
          receiver_id,
          amount,
          created_by: user.id,
          cycleId:group.currentCycleId
        },
        include: {
          group: true,
          payer: true,
          receiver: true,
          settlementCreator: true,
        },
      });
      return settlement;
    },
  },

  Query: {
    async getSettlementsByGroup(_, { group_id }, { prisma }) {
      return await prisma.settlement.findMany({
        where: { group_id },

        include: {
          group: true,
          payer: true,
          receiver: true,
          settlementCreator: true,
        },
      });
    },
  },
};
