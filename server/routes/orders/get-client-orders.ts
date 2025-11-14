import { protectedProcedure } from '@/server/trpc';

export const getClientOrders = protectedProcedure.query(async ({ ctx }) => {
  if (!ctx.userId) {
    return {
      message: 'دسترسی غیرمجاز',
      status: 'fail' as const,
      data: null,
    };
  }

  const orders = await ctx.prisma.order.findMany({
    where: {
      userId: ctx.userId,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map((order: any) => ({
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
    }));
});
