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
    const productIds = input.items.map((item) => item.productID);
    const existingProducts = await ctx.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (existingProducts.length !== productIds.length) {
      return {
        message: 'یک یا چند محصول یافت نشد',
        status: 'fail' as const,
      };
    }

    // Store products as JSON: [{ productId: string, quantity: number }]
    const productsData = input.items.map((item) => ({
      productId: item.productID,
      quantity: item.quantity,
    }));

    const order = await ctx.prisma.order.create({
      data: {
        userId: ctx.userId!,
        products: productsData as any,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phoneNumber: true,
            address: true,
          },
        },
      },
    });

    // Fetch products to return full product data
    const allProducts = await ctx.prisma.product.findMany({
      where: {
        id: {
          in: productIds,
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

    const productsMap = new Map(allProducts.map((p: any) => [p.id, p]));
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
          quantity: item.quantity,
        };
      })
      .filter(Boolean);

    return {
      message: 'سفارش با موفقیت ایجاد شد',
      status: 'success' as const,
      order: {
        id: order.id,
        products: orderProducts,
        user: {
          id: order.user.id,
          fullName: order.user.fullName,
          phoneNumber: order.user.phoneNumber,
          address: order.user.address,
        },
        createdAt: order.createdAt,
      },
    };
  });
