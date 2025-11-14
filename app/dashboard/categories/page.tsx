'use client';

import { useState } from 'react';
import { List } from '@/containers/routes/dashboard/categories/list';
import { ModalAddCategory } from '@/containers/routes/dashboard/categories/modal-add-category';
import { ModalEditCategory } from '@/containers/routes/dashboard/categories/modal-edit-category';

export default function Page() {
  const [editCategoryData, setEditCategoryData] = useState<{
    id: string;
    title: string;
    image: string;
  } | null>(null);

  const handleEditCategory = (data: {
    id: string;
    title: string;
    image: string;
  }) => {
    setEditCategoryData(data);
  };

  const handleCloseEditCategory = () => {
    setEditCategoryData(null);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <ModalAddCategory />
      <ModalEditCategory
        data={editCategoryData}
        onClose={handleCloseEditCategory}
      />
      <List onEditCategory={handleEditCategory} />
    </div>
  );
}
