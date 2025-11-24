import { z } from 'zod';
import { developmentOnlyProcedure } from '@/server/trpc';

export const editCategory = developmentOnlyProcedure
  .input(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1).optional(),
      imagePath: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id, ...inputData } = input;

    const category = await ctx.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return {
        message: 'دسته‌بندی یافت نشد',
        status: 'fail' as const,
      };
    }

    const updateData: {
      title?: string;
      image?: string;
    } = {};

    if (inputData.title) updateData.title = inputData.title;
    if (inputData.imagePath) updateData.image = inputData.imagePath;

    const updatedCategory = await ctx.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return {
      message: 'دسته‌بندی با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      category: {
        id: updatedCategory.id,
        title: updatedCategory.title,
        image: updatedCategory.image,
      },
    };
  });
