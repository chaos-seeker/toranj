'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { Feild } from '@/components/feild';
import { ToggleSection } from '@/components/toggle-section';
import { useToggleUrlState } from '@/hooks/toggle-url-state';
import { fileToBase64 } from '@/utils/file-to-base64';
import type { TCategory } from '@/types/category';

interface IModalEditProductProps {
  data?: {
    id: string;
    title: string;
    description: string;
    priceWithDiscount: number;
    priceWithoutDiscount: number;
    category: string;
    image: string;
  } | null;
  onClose?: () => void;
}

export function ModalEditProduct({ data, onClose }: IModalEditProductProps) {
  const editProductToggleUrlState = useToggleUrlState('edit-product');
  const utils = trpc.useUtils();
  const handleClose = () => {
    editProductToggleUrlState.hide();
    form.reset();
    onClose?.();
  };

  const formFields = {
    title: {
      type: 'text',
      label: 'عنوان',
      errors: {
        isRequired: 'این فیلد اجباری است!',
      },
    },
    description: {
      type: 'text',
      label: 'توضیحات',
      errors: {
        isRequired: 'این فیلد اجباری است!',
      },
    },
    priceWithoutDiscount: {
      type: 'number',
      label: 'مبلغ بدون تحفیف',
      errors: {
        isRequired: 'این فیلد اجباری است!',
      },
    },
    priceWithDiscount: {
      type: 'number',
      label: 'مبلغ با تحفیف',
      errors: {
        isRequired: 'این فیلد اجباری است!',
      },
    },
    image: {
      type: 'image',
      label: 'تصویر',
      errors: {
        isRequired: 'این فیلد اجباری است!',
        maxSize: 'حجم تصویر نباید بیشتر از 1 مگابایت باشد!',
      },
    },
    category: {
      type: 'select',
      label: 'دسته بندی',
      data: [] as any,
      errors: {
        isRequired: 'این فیلد اجباری است!',
      },
    },
  };
  const formSchema = z.object({
    image: z
      .any()
      .refine((file) => file?.length > 0, {
        message: formFields.image.errors.isRequired,
      })
      .refine(
        (file) => {
          if (!file || !file[0]) return true;
          return file[0].size <= 1024 * 1024;
        },
        {
          message: formFields.image.errors.maxSize,
        },
      ),
    title: z.string().min(1, {
      message: formFields.title.errors.isRequired,
    }),
    description: z.string().min(1, {
      message: formFields.description.errors.isRequired,
    }),
    priceWithoutDiscount: z.string().min(1, {
      message: formFields.priceWithoutDiscount.errors.isRequired,
    }),
    priceWithDiscount: z.string().min(1, {
      message: formFields.priceWithDiscount.errors.isRequired,
    }),
    category: z.string().min(1, {
      message: formFields.category.errors.isRequired,
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      title: '',
      description: '',
      priceWithoutDiscount: '',
      priceWithDiscount: '',
      category: '',
    },
  });
  const editProductMutation =
    trpc.routes.dashboard.products.editProduct.useMutation({
      onSuccess: async () => {
        await utils.routes.global.getProducts.invalidate();
        await utils.routes.home.getProductByCategoryId.invalidate();
      },
    });
  const fetchCategories = trpc.routes.global.getCategories.useQuery();
  const handleSubmitForm = async (formData: any) => {
    if (!data?.id) return;
    let imageBase64: string | undefined = undefined;
    if (formData.image[0]) {
      imageBase64 = await fileToBase64(formData.image[0]);
    }
    const res = await editProductMutation.mutateAsync({
      id: data.id,
      title: formData.title,
      description: formData.description,
      priceWithoutDiscount: Number(formData.priceWithoutDiscount),
      priceWithDiscount: Number(formData.priceWithDiscount),
      categoryId: formData.category,
      imagePath: imageBase64,
    });
    if (res.status === 'success') {
      toast.success(res.message);
      handleClose();
      form.reset();
    } else {
      toast.error(res.message);
    }
  };
  if (fetchCategories.isSuccess) {
    formFields.category.data = fetchCategories.data?.map((item: TCategory) => ({
      key: item.title,
      value: item.id,
    }));
  }

  useEffect(() => {
    if (editProductToggleUrlState.isShow && data) {
      form.reset({
        image: null,
        title: data.title,
        description: data.description,
        priceWithoutDiscount: String(data.priceWithoutDiscount),
        priceWithDiscount: String(data.priceWithDiscount),
        category: data.category,
      });
    }
  }, [editProductToggleUrlState.isShow, data]);

  return (
    <ToggleSection
      isShow={editProductToggleUrlState.isShow}
      isBackDrop
      onClose={handleClose}
      className="fixed left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2 sm:w-[500px]"
    >
      <div className="flex flex-col rounded-lg bg-white">
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="flex w-full flex-col p-3"
        >
          <div className="mb-4 mt-2 flex flex-col gap-2">
            {Object.entries(formFields).map(([key, field]) => (
              <Feild name={key} key={key} field={field} form={form} />
            ))}
          </div>
          <button
            type="submit"
            disabled={editProductMutation.isPending}
            className="rounded-lg bg-teal p-4 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editProductMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </form>
      </div>
    </ToggleSection>
  );
}
