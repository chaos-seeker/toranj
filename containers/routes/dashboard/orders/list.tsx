'use client';

import { trpc } from '@/lib/trpc';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { formatPrice } from '@/utils/format-price';

export function List() {
  const fetchClientOrders =
    trpc.routes.dashboard.orders.getDashboardOrders.useQuery();

  if (fetchClientOrders.isLoading) {
    return <Loader />;
  }

  if (fetchClientOrders.data?.length !== 0) {
    return <Empty text="سفارشی برای نمایش وجود ندارد!" />;
  }

  return (
    <section className="size-full">
      <div className="w-full min-w-max table-auto text-right text-sm [&_td]:px-4 [&_td]:py-1 [&_th]:border-b [&_th]:border-gray-200 [&_th]:p-4 [&_th_p]:block [&_th_p]:text-sm [&_th_p]:font-medium [&_th_p]:leading-none [&_th_p]:antialiased">
        <table className="w-full min-w-max table-auto text-right text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th>
                <p>#</p>
              </th>
              <th>
                <p>نام</p>
              </th>{' '}
              <th>
                <p>نام خانوادگی</p>
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
              (
                itemOrder: {
                  _id: string;
                  products: Array<{
                    productID: {
                      _id: string;
                      title: string;
                      description: string;
                      image: { path: string };
                      priceWithoutDiscount: number;
                      priceWithDiscount: number;
                      categoryID: string;
                    };
                    quantity: number;
                  }>;
                  userID: {
                    name: string;
                    lastName: string;
                    phone: string;
                    email: string;
                    address: string;
                  };
                  status: string;
                  createdAt: Date;
                },
                index: number,
              ) =>
                itemOrder.products.map(
                  (itemProduct: {
                    productID: {
                      _id: string;
                      title: string;
                      description: string;
                      image: { path: string };
                      priceWithoutDiscount: number;
                      priceWithDiscount: number;
                      categoryID: string;
                    };
                    quantity: number;
                  }) => (
                    <tr
                      key={itemProduct.productID._id}
                      className="even:bg-gray-50"
                    >
                      <td>{index + 1}</td>
                      <td>{itemOrder.userID.name}</td>
                      <td>{itemOrder.userID.lastName}</td>
                      <td>{itemOrder.userID.address}</td>
                      <td className="max-w-[150px] truncate text-right">
                        {itemProduct.productID.title}
                      </td>
                      <td>
                        {formatPrice(itemProduct.productID.priceWithDiscount)}
                      </td>
                      <td>
                        {formatPrice(
                          itemProduct.productID.priceWithoutDiscount,
                        )}
                      </td>
                      <td>{itemProduct.quantity}</td>
                      <td>
                        {formatPrice(
                          Number(itemProduct.productID.priceWithDiscount) *
                            itemProduct.quantity,
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
