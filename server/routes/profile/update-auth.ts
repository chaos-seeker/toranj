import { z } from 'zod';
import { protectedProcedure } from '@/server/trpc';

export const updateAuth = protectedProcedure
  .input(
    z.object({
      name: z.string().min(1).optional(),
      lastName: z.string().min(1).optional(),
      phone: z.string().min(1).optional(),
      email: z.string().email().optional(),
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
      name?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      address?: string;
    } = {};

    if (input.name) updateData.name = input.name;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.phone) updateData.phone = input.phone;
    if (input.email) updateData.email = input.email;
    if (input.address) updateData.address = input.address;

    if (input.phone || input.email) {
      const existingUser = await ctx.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: ctx.userId } },
            {
              OR: input.phone ? [{ phone: input.phone }] : [],
              ...(input.email ? [{ email: input.email }] : {}),
            },
          ],
        },
      });

      if (existingUser) {
        return {
          message: 'شماره تلفن یا ایمیل قبلاً استفاده شده است',
          status: 'fail' as const,
        };
      }
    }

    const user = await ctx.prisma.user.update({
      where: { id: ctx.userId },
      data: updateData,
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
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      user: {
        _id: user.id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  });
