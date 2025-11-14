import { publicProcedure } from '@/server/trpc';

export const getProducts = publicProcedure.query(async ({ ctx }) => {
  const products = await ctx.prisma.product.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      image: true,
      priceWithoutDiscount: true,
      priceWithDiscount: true,
      category: {
        select: {
          id: true,
          title: true,
          image: true,
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
    image: product.image,
    priceWithoutDiscount: product.priceWithoutDiscount,
    priceWithDiscount: product.priceWithDiscount,
    category: {
      id: product.category.id,
      title: product.category.title,
      image: product.category.image,
    },
  }));
});
