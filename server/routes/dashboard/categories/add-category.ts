import { z } from 'zod';
import { adminProcedure } from '@/server/trpc';

export const addCategory = adminProcedure
  .input(
    z.object({
      title: z.string().min(1),
      imagePath: z.string().min(1),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const category = await ctx.prisma.category.create({
      data: {
        name: input.title,
        image: input.imagePath,
      },
    });

    return {
      message: 'دسته‌بندی با موفقیت اضافه شد',
      status: 'success' as const,
      category: {
        id: category.id,
        title: category.name,
        image: category.image,
      },
    };
  });
