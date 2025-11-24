import { z } from 'zod';
import { developmentOnlyProcedure } from '@/server/trpc';

export const deleteCategory = developmentOnlyProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const category = await ctx.prisma.category.findUnique({
      where: { id: input.id },
      include: {
        products: true,
      },
    });

    if (!category) {
      return {
        message: 'دسته‌بندی یافت نشد',
        status: 'fail' as const,
      };
    }

    if (category.products.length > 0) {
      return {
        message: 'نمی‌توان دسته‌بندی دارای محصول را حذف کرد',
        status: 'fail' as const,
      };
    }

    await ctx.prisma.category.delete({
      where: { id: input.id },
    });

    return {
      message: 'دسته‌بندی با موفقیت حذف شد',
      status: 'success' as const,
    };
  });
