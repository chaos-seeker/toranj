import { z } from 'zod';
import { adminProcedure } from '../../../trpc';

export const deleteProduct = adminProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: input.id },
    });

    if (!product) {
      return {
        message: 'محصول یافت نشد',
        status: 'fail' as const,
      };
    }

    await ctx.prisma.product.delete({
      where: { id: input.id },
    });

    return {
      message: 'محصول با موفقیت حذف شد',
      status: 'success' as const,
    };
  });
