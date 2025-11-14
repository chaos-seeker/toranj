import { adminProcedure } from '../../../trpc';

export const getUsers = adminProcedure.query(async ({ ctx }) => {
  const users = await ctx.prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastName: true,
      phone: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return users.map((user: any) => ({
    _id: user.id,
    name: user.name,
    lastName: user.lastName,
    phone: user.phone,
    email: user.email,
    address: user.address,
    role: user.role,
    createdAt: user.createdAt,
  }));
});
