import { cookies } from 'next/headers';
import { protectedProcedure } from '@/server/trpc';

const removeTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
};

export const logout = protectedProcedure.mutation(async () => {
  await removeTokenCookie();
  return {
    message: 'خروج با موفقیت انجام شد',
    status: 'success' as const,
  };
});
