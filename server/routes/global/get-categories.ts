import { publicProcedure } from '@/server/trpc';

export const getCategories = publicProcedure.query(async ({ ctx }) => {
  const categories = await ctx.prisma.category.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return categories.map((category: any) => ({
    _id: category.id,
    title: category.title,
    image: {
      path: category.imagePath,
    },
  }));
});
