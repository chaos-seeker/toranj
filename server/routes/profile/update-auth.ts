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
    if (!ctx.userId) {
      return {
        message: 'دسترسی غیرمجاز',
        status: 'fail' as const,
      };
    }

    const updateData: {
      fullName?: string;
      phone?: string;
      address?: string;
    } = {};

    if (input.fullName) updateData.fullName = input.fullName;
    if (input.phoneNumber) updateData.phone = input.phoneNumber;
    if (input.address) updateData.address = input.address;

    if (input.phoneNumber) {
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          AND: [{ id: { not: ctx.userId } }, { phone: input.phoneNumber }],
        },
      });

      if (existingUser) {
        return {
          message: 'شماره تلفن قبلاً استفاده شده است',
          status: 'fail' as const,
        };
      }
    }

    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        phone: true,
        address: true,
      },
    });

    return {
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phone,
        address: user.address,
      },
    };
  });
