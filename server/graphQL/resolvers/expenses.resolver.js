
import { DateTimeResolver, JSONResolver } from "graphql-scalars";


export const expensesResolvers = {
    JSON:JSONResolver,
    DateTime:DateTimeResolver,

  Query: {
    async getExpensesByGroup(_,{groupId},{prisma}){
        return await prisma.expense.findMany({
            where:{groupId},
            orderBy: { createdAt: 'desc' },
            include:{
                category:true,
                group:true,
                createdByUser:true
            }
        }) 
    },

    async getExpenseById(_,{id},{prisma}){
        return await prisma.expense.findUnique({
          where: { id },
          include: {
            category: true,
            group: true,
            createdByUser: true,
          },
        });
    }
  },
  Mutation: {
    async createExpense(_,{input},{prisma,user}){
      if(!user){
        throw new Error("User not authenticated");
      }
      const {
        title,
        description,
        groupId,
        totalAmount,
        categoryId,
        paid_by,
        shared_amounts,

      } = input;

      // if(!title || !totalAmount ) throw error
        const expense = await prisma.expense.create({
          data: {
            title,
            description: description || null,
            groupId,
            totalAmount: Number(totalAmount),
            categoryId: categoryId,
            paid_by, // JSON array from frontend
            shared_amounts, // JSON array from frontend
            created_by: user.id,
          },
          include: {
            category: true,
            group: true,
            createdByUser: true,
          },
        });
        return expense;
    },

    async updateExpense(_,{id,input},{prisma,user}){
      if(!user){
        throw new Error("User not authenticated");
      }
      const expenseId = id;
      const existing = prisma.expense.findUnique({
        where:{id:expenseId}
      }) 
      if(!existing){
        throw new Error("Expense doesnt exist");
        
      }
      const {
        title,
        description,
        totalAmount,
        categoryId,
        paid_by,
        shared_amounts,
        is_settled
      } = input;

      const updatedExpense = prisma.expense.update({
        where:{id:expenseId},
        data:{
          title: title?? existing.title,
          description: description ?? existing.description,
          totalAmount: totalAmount ?? paid_by.reduce((sum,p)=> sum+Number(p.amount),0),
          categoryId: categoryId ?? existing.categoryId,
          paid_by: paid_by ?? existing.paid_by,
          shared_amounts: shared_amounts ?? existing.shared_amounts,
          is_settled: is_settled ?? existing.is_settled,
        },
        include: {
          category: true,
          group: true,
          createdByUser: true,
        },
      })
      return updatedExpense;
    }
  },
};



    
//     deleteExpense: async (_, { id }, { prisma, user }) => {
//       if (!user) throw new Error("Authentication required");
//       const expenseId = Number(id);
//       const existing = await prisma.expense.findUnique({ where: { id: expenseId } });
//       if (!existing) throw new Error("Expense not found");
//       // Authorization: only creator or admin can delete
//       if (existing.createdBy !== user.id) {
//         throw new Error("Not authorized to delete this expense");
//       }
//       // If there are settlement rows or foreign keys, either delete them first or use cascade in DB.
//       await prisma.settlement.deleteMany({ where: { expenseId } }).catch(() => {});
//       await prisma.expense.delete({ where: { id: expenseId } });
//       return true;
//     },
//     settleExpense: async (_, { id }, { prisma, user }) => {
//       if (!user) throw new Error("Authentication required");
//       const expenseId = Number(id);
//       const expense = await prisma.expense.findUnique({ where: { id: expenseId } });
//       if (!expense) throw new Error("Expense not found");
//       // Authorization: (maybe only group admin or creator)
//       // if (expense.createdBy !== user.id) throw new Error("Not authorized");
//       // Mark expense settled. If you want to create settlement rows, do it here.
//       const updated = await prisma.expense.update({
//         where: { id: expenseId },
//         data: { isSettled: true },
//         include: { category: true, group: true, createdByUser: true, settlements: true },
//       });
//       return updated;
//     },
//   },
// };












