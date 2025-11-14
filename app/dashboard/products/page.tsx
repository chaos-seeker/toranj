'use client';

import { useState } from 'react';
import { List } from '@/containers/routes/dashboard/products/list';
import { ModalAddProduct } from '@/containers/routes/dashboard/products/modal-add-product';
import { ModalEditProduct } from '@/containers/routes/dashboard/products/modal-edit-product';

export default function Page() {
  const [editProductData, setEditProductData] = useState<{
    id: string;
    title: string;
    description: string;
    priceWithDiscount: number;
    priceWithoutDiscount: number;
    category: string;
    image: string;
  } | null>(null);

  const handleEditProduct = (data: {
    id: string;
    title: string;
    description: string;
    priceWithDiscount: number;
    priceWithoutDiscount: number;
    category: string;
    image: string;
  }) => {
    setEditProductData(data);
  };

  const handleCloseEditProduct = () => {
    setEditProductData(null);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <ModalAddProduct />
      <ModalEditProduct
        data={editProductData}
        onClose={handleCloseEditProduct}
      />
      <List onEditProduct={handleEditProduct} />
    </div>
  );
}
