import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { publicProcedure } from '@/server/trpc';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getAuth = publicProcedure.query(async ({ ctx }) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };

    const user = await ctx.prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        address: true,
        orders: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!user) return null;

    // Fetch all products for all orders
    const allProductIds = new Set<string>();
    user.orders.forEach((order: any) => {
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

    const orders = user.orders.map((order: any) => {
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
          id: user.id,
          fullName: user.fullName,
          phoneNumber: user.phoneNumber,
          address: user.address,
        },
        createdAt: order.createdAt,
      };
    });

    return {
      id: user.id,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      orders,
    };
  } catch {
    return null;
  }
});
