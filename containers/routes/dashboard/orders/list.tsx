'use client';

import { trpc } from '@/lib/trpc';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { formatPrice } from '@/utils/format-price';
import type { TOrder } from '@/types/order';
import type { TProduct } from '@/types/product';

export function List() {
  const fetchClientOrders =
    trpc.routes.dashboard.orders.getDashboardOrders.useQuery();

  if (fetchClientOrders.isLoading) {
    return <Loader />;
  }

  if (fetchClientOrders.data?.length === 0 || !fetchClientOrders.data) {
    return <Empty text="سفارشی برای نمایش وجود ندارد!" />;
  }

  return (
    <section className="size-full">
      <div className="relative flex size-full h-fit flex-col overflow-auto rounded-xl border border-teal/20 bg-white bg-clip-border text-gray-600">
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
              <th>
                <p>محصول</p>
              </th>
              <th>
                <p>مبلغ با تخفیف</p>
              </th>
              <th>
                <p>مبلغ بدون تخفیف</p>
              </th>
              <th>
                <p>تعداد</p>
              </th>
              <th>
                <p>مبلغ نهایی</p>
              </th>
            </tr>
          </thead>
          <tbody>
            {fetchClientOrders.data?.map(
              (itemOrder: TOrder, orderIndex: number) =>
                itemOrder.products.map(
                  (itemProduct: TProduct, productIndex: number) => (
                    <tr
                      key={`${itemOrder.id}-${itemProduct._id}-${productIndex}`}
                      className="even:bg-gray-50"
                    >
                      <td>{orderIndex + 1}</td>
                      <td>{itemOrder.user.fullName}</td>
                      <td>{itemOrder.user.phoneNumber}</td>
                      <td>{itemOrder.user.address}</td>
                      <td className="max-w-[150px] truncate text-right">
                        {itemProduct.title}
                      </td>
                      <td>{formatPrice(itemProduct.priceWithDiscount)}</td>
                      <td>{formatPrice(itemProduct.priceWithoutDiscount)}</td>
                      <td>{itemProduct.quantity || 1}</td>
                      <td>
                        {formatPrice(
                          itemProduct.priceWithDiscount *
                            (itemProduct.quantity || 1),
                        )}
                      </td>
                    </tr>
                  ),
                ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
