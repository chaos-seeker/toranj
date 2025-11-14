import { z } from 'zod';
import { adminProcedure } from '../../../trpc';

export const changeUserRole = adminProcedure
  .input(
    z.object({
      id: z.string().min(1),
      role: z.enum(['USER', 'ADMIN']),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    if (input.id === ctx.userId) {
      return {
        message: 'نمی‌توانید نقش خود را تغییر دهید',
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

    const updatedUser = await ctx.prisma.user.update({
      where: { id: input.id },
      data: {
        role: input.role,
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        phone: true,
        email: true,
        address: true,
        role: true,
      },
    });

    return {
      message: 'نقش کاربر با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      user: {
        _id: updatedUser.id,
        name: updatedUser.name,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        email: updatedUser.email,
        address: updatedUser.address,
        role: updatedUser.role,
      },
    };
  });
