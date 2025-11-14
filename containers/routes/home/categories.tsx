'use client';

import 'swiper/css';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { trpc } from '@/lib/trpc';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { ProductCard } from '@/components/product-card';
import { cn } from '@/utils/cn';

export function Categories() {
  const [activedIndex, setActivedIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  return (
    <section className="container flex w-screen flex-col gap-7">
      <div className="flex flex-col gap-5">
        <Top
          activedIndex={activedIndex}
          setActivedIndex={setActivedIndex}
          swiperRef={swiperRef}
        />
        <Bottom activedIndex={activedIndex} />
      </div>
    </section>
  );
}

interface ITopProps {
  activedIndex: number;
  setActivedIndex: (index: number) => void;
  swiperRef: any;
}

const Top = (props: ITopProps) => {
  const handleActiveCategory = (value: number) => {
    props.setActivedIndex(value);
  };
  const fetchCategories = trpc.routes.global.getCategories.useQuery();

  if (fetchCategories.data?.length === 0) {
    return <Empty text="دسته بندی ای برای نمایش وجود ندارد!" />;
  }

  return (
    <div className="flex justify-center">
      <Swiper
        slidesPerView="auto"
        spaceBetween={8}
        onSwiper={(swiper) => (props.swiperRef.current = swiper)}
        id="categories-slider"
      >
        {fetchCategories.data?.map(
          (
            item: { _id: string; title: string; image: { path: string } },
            index: number,
          ) => (
            <SwiperSlide key={item._id} className="!w-fit rounded-lg">
              <button
                onClick={() => handleActiveCategory(index)}
                className={cn(
                  'rounded-xl border transition-all w-[100px] overflow-hidden bg-white p-1.5',
                  {
                    'bg-green font-bold': props.activedIndex === index,
                  },
                )}
              >
                <div
                  className={cn('flex flex-col gap-2 p-1 items-center', {
                    'border-dashed border-2 border-teal rounded-lg':
                      props.activedIndex === index,
                  })}
                >
                  <Image
                    src={`${process.env.BASE_URL}${item.image.path}`}
                    alt={item.title}
                    width={50}
                    height={50}
                  />
                  <p>{item.title}</p>
                </div>
              </button>
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  );
};

interface IBottomProps {
  activedIndex: number;
}

const Bottom = (props: IBottomProps) => {
  const fetchCategories = trpc.routes.global.getCategories.useQuery();
  const fetchProductsByCategory =
    trpc.routes.home.getProductByCategoryId.useQuery(
      {
        categoryId: String(
          fetchCategories.data?.[props.activedIndex]?._id || '',
        ),
      },
      {
        enabled: !!fetchCategories.data?.[props.activedIndex]?._id,
      },
    );

  if (fetchProductsByCategory.isLoading) {
    return <Loader />;
  }

  if (
    fetchProductsByCategory.data?.length === 0 ||
    fetchCategories.data?.length === 0
  ) {
    return <Empty text="محصولی برای نمایش وجود ندارد!" />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fetchProductsByCategory.data?.map(
        (item: {
          _id: string;
          title: string;
          description: string;
          image: { path: string };
          priceWithoutDiscount: number;
          priceWithDiscount: number;
          categoryID: string;
        }) => (
          <ProductCard key={item._id} data={item} />
        ),
      )}
    </div>
  );
};
