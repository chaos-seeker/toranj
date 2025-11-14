import { cookies } from 'next/headers';
import { protectedProcedure, router } from '../../../trpc';

const removeTokenCookie = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('token');
};

export const logoutRouter = router({
  logout: protectedProcedure.mutation(async () => {
    await removeTokenCookie();
    return {
      message: 'خروج با موفقیت انجام شد',
      status: 'success' as const,
    };
  }),
});
