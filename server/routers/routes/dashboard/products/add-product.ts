import { z } from 'zod';
import { adminProcedure, router } from '../../../../trpc';

export const addProductRouter = router({
  addProduct: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        imagePath: z.string().min(1),
        priceWithoutDiscount: z.number().positive(),
        priceWithDiscount: z.number().positive(),
        categoryId: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.categoryId },
      });

      if (!category) {
        return {
          message: 'دسته‌بندی یافت نشد',
          status: 'fail' as const,
        };
      }

      const product = await ctx.prisma.product.create({
        data: {
          title: input.title,
          description: input.description,
          imagePath: input.imagePath,
          priceWithoutDiscount: input.priceWithoutDiscount,
          priceWithDiscount: input.priceWithDiscount,
          categoryId: input.categoryId,
        },
        include: {
          category: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      return {
        message: 'محصول با موفقیت اضافه شد',
        status: 'success' as const,
        product: {
          _id: product.id,
          title: product.title,
          description: product.description,
          image: {
            path: product.imagePath,
          },
          priceWithoutDiscount: product.priceWithoutDiscount,
          priceWithDiscount: product.priceWithDiscount,
          categoryID: product.categoryId,
        },
      };
    }),
});
