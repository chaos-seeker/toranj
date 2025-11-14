'use client';

import { trpc } from '@/lib/trpc';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { ProductCard } from '@/components/product-card';

export function List() {
  const fetchProducts = trpc.routes.global.getProducts.useQuery();

  if (fetchProducts.isLoading) {
    return <Loader />;
  }

  if (fetchProducts.data?.length === 0 || !fetchProducts.data) {
    return <Empty text="محصولی برای نمایش وجود ندارد!" />;
  }

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fetchProducts.data?.map((item) => (
        <ProductCard key={item._id} data={item} />
      ))}
    </section>
  );
}
