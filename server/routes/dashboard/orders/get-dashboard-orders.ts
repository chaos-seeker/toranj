import { adminProcedure } from '@/server/trpc';

export const getDashboardOrders = adminProcedure.query(async ({ ctx }) => {
  const orders = await ctx.prisma.order.findMany({
    include: {
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

  // Fetch all products for all orders
  const allProductIds = new Set<string>();
  orders.forEach((order: any) => {
    const products = order.products as any[];
    products.forEach((item: any) => {
      allProductIds.add(item.productId);
    });
  });

  const products = await ctx.prisma.product.findMany({
    where: {
      id: {
        in: Array.from(allProductIds),
      },
    },
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

  const productsMap = new Map(products.map((p: any) => [p.id, p]));

  return orders.map((order: any) => {
    const orderProducts = (order.products as any[])
      .map((item: any) => {
        const product = productsMap.get(item.productId) as any;
        if (!product) return null;
        return {
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
        };
      })
      .filter(Boolean);

    return {
      id: order.id,
      products: orderProducts,
      user: {
        id: order.user.id,
        fullName: order.user.fullName,
        phoneNumber: order.user.phone,
        address: order.user.address,
      },
      createdAt: order.createdAt,
    };
  });
});
