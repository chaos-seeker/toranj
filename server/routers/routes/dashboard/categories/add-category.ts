import { z } from 'zod';
import { adminProcedure, router } from '../../../../trpc';

export const addCategoryRouter = router({
  addCategory: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        imagePath: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.create({
        data: {
          title: input.title,
          imagePath: input.imagePath,
        },
      });

      return {
        message: 'دسته‌بندی با موفقیت اضافه شد',
        status: 'success' as const,
        category: {
          _id: category.id,
          title: category.title,
          image: {
            path: category.imagePath,
          },
        },
      };
    }),
});
