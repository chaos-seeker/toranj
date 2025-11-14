'use client';

import toast from 'react-hot-toast';
import { IoMdTrash } from 'react-icons/io';
import { trpc } from '@/lib/trpc';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import type { TUser } from '@/types/user';

export function List() {
  const fetchUsers = trpc.routes.dashboard.users.getUsers.useQuery();
  const deleteUserMutation = trpc.routes.dashboard.users.deleteUser.useMutation(
    {
      onSuccess: () => {
        fetchUsers.refetch();
      },
    },
  );

  if (fetchUsers.isLoading) {
    return <Loader />;
  }

  if (fetchUsers.data?.length === 0 || !fetchUsers.data) {
    return <Empty text="کاربری وجود ندارد" />;
  }

  const handleDeleteUser = async (id: string) => {
    const res = await deleteUserMutation.mutateAsync({ id });
    if (res.status === 'success') {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <section className="size-full overflow-hidden">
      <div className="overflow-x-auto rounded-xl border border-teal/20">
        <table className="w-full min-w-max table-auto text-right text-sm [&_td]:px-4 [&_td]:py-1 [&_th]:border-b [&_th]:border-gray-200 [&_th]:p-4 [&_th_p]:block [&_th_p]:text-sm [&_th_p]:font-medium [&_th_p]:leading-none [&_th_p]:antialiased">
          <thead className="bg-gray-200">
            <tr>
              <th>
                <p>#</p>
              </th>
              <th>
                <p>نام و نام خانوادگی</p>
              </th>
              <th>
                <p>شماره موبایل</p>
              </th>
              <th>
                <p>آدرس</p>
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {fetchUsers.data?.map((item: TUser, index: number) => (
              <tr key={item.id} className="odd:bg-gray-50">
                <td>{index + 1}</td>
                <td>{item.fullName}</td>
                <td>{item.phoneNumber}</td>
                <td>{item.address}</td>
                <td className="text-right">
                  <button onClick={() => handleDeleteUser(item.id)}>
                    <IoMdTrash size={22} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
