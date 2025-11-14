import { publicProcedure } from '@/server/trpc';

export const getProducts = publicProcedure.query(async ({ ctx }) => {
  const products = await ctx.prisma.product.findMany({
    include: {
      category: {
        select: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return products.map((product: any) => ({
    _id: product.id,
    title: product.title,
    description: product.description,
    image: {
      path: product.imagePath,
    },
    priceWithoutDiscount: product.priceWithoutDiscount,
    priceWithDiscount: product.priceWithDiscount,
    categoryID: product.categoryId,
  }));
});
