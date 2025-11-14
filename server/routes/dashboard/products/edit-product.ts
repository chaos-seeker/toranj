import { z } from 'zod';
import { adminProcedure } from '@/server/trpc';

export const editProduct = adminProcedure
  .input(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      imagePath: z.string().min(1).optional(),
      priceWithoutDiscount: z.number().positive().optional(),
      priceWithDiscount: z.number().positive().optional(),
      categoryId: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id, ...updateData } = input;

    const existingProduct = await ctx.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        message: 'محصول یافت نشد',
        status: 'fail' as const,
      };
    }

    if (updateData.categoryId) {
      const category = await ctx.prisma.category.findUnique({
        where: { id: updateData.categoryId },
      });

      if (!category) {
        return {
          message: 'دسته‌بندی یافت نشد',
          status: 'fail' as const,
        };
      }
    }

    const product = await ctx.prisma.product.update({
      where: { id },
      data: updateData,
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
      message: 'محصول با موفقیت به‌روزرسانی شد',
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
  });
