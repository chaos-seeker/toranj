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
      name: z.string().min(1),
      lastName: z.string().min(1),
      phone: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(6),
      address: z.string().min(1),
      confirmPassword: z.string().min(6),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    if (input.password !== input.confirmPassword) {
      return {
        message: 'رمز عبور و تکرار آن مطابقت ندارند',
        status: 'fail' as const,
      };
    }

    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        OR: [{ email: input.email }, { phone: input.phone }],
      },
    });

    if (existingUser) {
      return {
        message: 'کاربری با این ایمیل یا شماره تلفن قبلاً ثبت شده است',
        status: 'fail' as const,
      };
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await ctx.prisma.user.create({
      data: {
        name: input.name,
        lastName: input.lastName,
        phone: input.phone,
        email: input.email,
        password: hashedPassword,
        address: input.address,
        role: 'USER',
      },
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

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    await setTokenCookie(token);

    return {
      message: 'ثبت‌نام با موفقیت انجام شد',
      status: 'success' as const,
      user,
    };
  });
