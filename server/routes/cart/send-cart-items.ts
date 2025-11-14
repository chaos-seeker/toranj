import { z } from 'zod';
import { protectedProcedure } from '@/server/trpc';

export const sendCartItems = protectedProcedure
  .input(
    z.object({
      items: z.array(
        z.object({
          productID: z.string(),
          quantity: z.number().int().positive(),
        }),
      ),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    if (!ctx.userId) {
      return {
        message: 'دسترسی غیرمجاز',
        status: 'fail' as const,
      };
    }

    const productIds = input.items.map((item) => item.productID);
    const products = await ctx.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      return {
        message: 'یک یا چند محصول یافت نشد',
        status: 'fail' as const,
      };
    }

    const order = await ctx.prisma.order.create({
      data: {
        userId: ctx.userId!,
        items: {
          create: input.items.map((item) => ({
            productId: item.productID,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    return {
      message: 'سفارش با موفقیت ایجاد شد',
      status: 'success' as const,
      order: {
        id: order.id,
        products: order.items.map((item: any) => ({
          productID: {
            _id: item.product.id,
            title: item.product.title,
            description: item.product.description,
            image: {
              path: item.product.image,
            },
            priceWithoutDiscount: item.product.priceWithoutDiscount,
            priceWithDiscount: item.product.priceWithDiscount,
            categoryID: item.product.categoryId,
          },
          quantity: item.quantity,
        })),
        user: {
          id: order.user.id,
          fullName: order.user.fullName,
          phoneNumber: order.user.phone,
          address: order.user.address,
        },
        createdAt: order.createdAt,
      },
    };
  });
