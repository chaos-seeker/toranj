import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { publicProcedure } from '@/server/trpc';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const setTokenCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7,
  });
};

export const login = publicProcedure
  .input(
    z.object({
      phone: z.string().min(1),
      password: z.string().min(1),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { phone: input.phone },
    });

    if (!user) {
      return {
        message: 'شماره تلفن یا رمز عبور اشتباه است',
        status: 'fail' as const,
      };
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      return {
        message: 'شماره تلفن یا رمز عبور اشتباه است',
        status: 'fail' as const,
      };
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await setTokenCookie(token);

    return {
      message: 'ورود با موفقیت انجام شد',
      status: 'success' as const,
      user: {
        _id: user.id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    };
  });
