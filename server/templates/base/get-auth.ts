import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { publicProcedure } from '../../trpc

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const getAuth = publicProcedure.query(async ({ ctx }) => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
      if (!token) return null;

      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: 'USER' | 'ADMIN';
      };

      const user = await ctx.prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          name: true,
          lastName: true,
          phone: true,
          email: true,
          address: true,
          role: true,
        },
      });

      if (!user) return null;

      return {
        _id: user.id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
      };
    } catch {
      return null;
    }
  });
