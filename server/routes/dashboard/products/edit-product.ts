import { z } from 'zod';
import { developmentOnlyProcedure } from '@/server/trpc';

export const editProduct = developmentOnlyProcedure
  .input(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      imagePath: z.string().min(1).optional(),
      priceWithoutDiscount: z.number().positive().optional(),
      priceWithDiscount: z.number().positive().optional(),
      categoryId: z.string().min(1).optional(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { id, ...inputData } = input;

    const existingProduct = await ctx.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        message: 'محصول یافت نشد',
        status: 'fail' as const,
      };
    }

    if (inputData.categoryId) {
      const category = await ctx.prisma.category.findUnique({
        where: { id: inputData.categoryId },
      });

      if (!category) {
        return {
          message: 'دسته‌بندی یافت نشد',
          status: 'fail' as const,
        };
      }
    }

    const updateData: {
      title?: string;
      description?: string;
      image?: string;
      priceWithoutDiscount?: number;
      priceWithDiscount?: number;
      categoryId?: string;
    } = {};

    if (inputData.title) updateData.title = inputData.title;
    if (inputData.description) updateData.description = inputData.description;
    if (inputData.imagePath) updateData.image = inputData.imagePath;
    if (inputData.priceWithoutDiscount)
      updateData.priceWithoutDiscount = inputData.priceWithoutDiscount;
    if (inputData.priceWithDiscount)
      updateData.priceWithDiscount = inputData.priceWithDiscount;
    if (inputData.categoryId) updateData.categoryId = inputData.categoryId;

    const product = await ctx.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: {
            id: true,
            title: true,
            image: true,
          },
        },
      },
    });

    return {
      message: 'محصول با موفقیت به‌روزرسانی شد',
      status: 'success' as const,
      product: {
        _id: product.id,
        title: product.title,
        description: product.description,
        image: product.image,
        priceWithoutDiscount: product.priceWithoutDiscount,
        priceWithDiscount: product.priceWithDiscount,
        category: {
          id: product.category.id,
          title: product.category.title,
          image: product.category.image,
        },
      },
    };
  });
