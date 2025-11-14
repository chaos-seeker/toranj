import { adminProcedure } from '@/server/trpc';

export const getDashboardOrders = adminProcedure.query(async ({ ctx }) => {
  const orders = await ctx.prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          email: true,
          address: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders.map((order: any) => ({
    _id: order.id,
    products: order.items.map((item: any) => ({
      productID: {
        _id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        image: {
          path: item.product.imagePath,
        },
        priceWithoutDiscount: item.product.priceWithoutDiscount,
        priceWithDiscount: item.product.priceWithDiscount,
        categoryID: item.product.categoryId,
      },
      quantity: item.quantity,
    })),
    userID: {
      name: order.user.name,
      lastName: order.user.lastName,
      phone: order.user.phone,
      email: order.user.email,
      address: order.user.address,
    },
    status: order.status,
    createdAt: order.createdAt,
  }));
});
