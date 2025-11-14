import { z } from 'zod';
import { adminProcedure } from '../../../trpc';

export const deleteUser = adminProcedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    if (input.id === ctx.userId) {
      return {
        message: 'نمی‌توانید حساب کاربری خود را حذف کنید',
        status: 'fail' as const,
      };
    }

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
