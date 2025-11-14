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
          phone: true,
          address: true,
        },
      });

      if (!user) return null;

      return {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phone,
        address: user.address,
      };
    } catch {
      return null;
    }
  });
