import { publicProcedure } from '@/server/trpc';

export const getUsers = publicProcedure.query(async ({ ctx }) => {
  const users = await ctx.prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      phoneNumber: true,
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
    phoneNumber: user.phoneNumber,
    address: user.address,
    createdAt: user.createdAt,
  }));
});
