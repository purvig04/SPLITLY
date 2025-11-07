export const categoriesResolvers = {
  Query: {
    async getAllCategories(_,__,{prisma}){
        return await prisma.category.findMany();
    }
  },
};
