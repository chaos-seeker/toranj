import { initTRPC, TRPCError } from '@trpc/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface Context {
  prisma: any;
  userId?: string;
  userRole?: 'USER' | 'ADMIN';
}

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

const getUserFromToken = async (): Promise<{
  userId: string;
} | null> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
    };
    return decoded;
  } catch {
    return null;
  }
};

export const protectedProcedure = t.procedure.use(async (opts) => {
  const user = await getUserFromToken();
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'دسترسی غیرمجاز - لطفا وارد حساب کاربری خود شوید',
    });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: user.userId,
      userRole: undefined,
    },
  });
});

export const adminProcedure = t.procedure.use(async (opts) => {
  const user = await getUserFromToken();
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'دسترسی غیرمجاز - لطفا وارد حساب کاربری خود شوید',
    });
  }
  // Since we don't have role anymore, adminProcedure is same as protectedProcedure
  return opts.next({
    ctx: {
      ...opts.ctx,
      userId: user.userId,
      userRole: undefined,
    },
  });
});
