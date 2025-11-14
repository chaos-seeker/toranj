import { z } from 'zod';
import { publicProcedure } from '@/server/trpc';

export const getProductByCategoryId = publicProcedure
  .input(z.object({ categoryId: z.string() }))
  .query(async ({ input, ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        categoryId: input.categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
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
        path: product.image,
      },
      priceWithoutDiscount: product.priceWithoutDiscount,
      priceWithDiscount: product.priceWithDiscount,
      categoryID: product.categoryId,
    }));
  });
