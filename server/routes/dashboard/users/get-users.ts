import { adminProcedure } from '@/server/trpc';

export const getUsers = adminProcedure.query(async ({ ctx }) => {
  const users = await ctx.prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      phone: true,
      address: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map((user: any) => ({
    id: user.id,
    fullName: user.fullName,
    phoneNumber: user.phone,
    address: user.address,
    createdAt: user.createdAt,
  }));
});
