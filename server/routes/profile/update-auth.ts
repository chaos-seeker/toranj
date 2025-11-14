import { z } from 'zod';
import { protectedProcedure } from '@/server/trpc';

export const updateAuth = protectedProcedure
  .input(
    z.object({
      fullName: z.string().min(1).optional(),
      phoneNumber: z.string().min(1).optional(),
      address: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const updateData: {
      fullName?: string;
      address?: string;
    } = {};

    if (input.fullName) updateData.fullName = input.fullName;
    if (input.address) updateData.address = input.address;

    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        address: true,
      },
    });

    return {
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    };
  });
