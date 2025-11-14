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

export const register = publicProcedure
  .input(
    z.object({
      fullName: z.string().min(3),
      phoneNumber: z.string().regex(/^0\d{10}$/),
      password: z.string().min(8),
      address: z.string().min(10),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        phoneNumber: input.phoneNumber,
      },
    });

    if (existingUser) {
      return {
        message: 'کاربری با این شماره تلفن قبلاً ثبت شده است',
        status: 'fail' as const,
      };
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await ctx.prisma.user.create({
      data: {
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        password: hashedPassword,
        address: input.address,
      },
      select: {
        id: true,
        fullName: true,
        phoneNumber: true,
        address: true,
      },
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await setTokenCookie(token);

    return {
      message: 'ثبت‌نام با موفقیت انجام شد',
      status: 'success' as const,
      user: {
        id: user.id,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    };
  });
