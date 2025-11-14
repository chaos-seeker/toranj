import { z } from 'zod';
import { publicProcedure } from '@/server/trpc';

export const deleteUser = publicProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: input.id },
    });

    if (!user) {
      return {
        message: 'کاربر یافت نشد',
        status: 'fail' as const,
      };
    }

    await ctx.prisma.user.delete({
      where: { id: input.id },
    });

    return {
      message: 'کاربر با موفقیت حذف شد',
      status: 'success' as const,
    };
  });
