'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { Feild } from '@/components/feild';
import { ToggleSection } from '@/components/toggle-section';
import { useToggleUrlState } from '@/hooks/toggle-url-state';
import { fileToBase64 } from '@/utils/file-to-base64';

export function ModalEditCategory() {
  const searchParams = useSearchParams();
  const editCategoryToggleUrlState = useToggleUrlState('edit-category');
  const handleClose = () => {
    editCategoryToggleUrlState.hide(['title', 'id', 'image']);
    form.reset();
  };
  const utils = trpc.useUtils();

  // form
  const formFields = {
    title: {
      type: 'text',
      label: 'عنوان',
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
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
      title: '',
    },
  });
  const editCategoryMutation =
    trpc.routes.dashboard.categories.editCategory.useMutation({
      onSuccess: async () => {
        await utils.routes.global.getCategories.invalidate();
        await utils.routes.global.getProducts.invalidate();
        await utils.routes.home.getProductByCategoryId.invalidate();
      },
    });
  const handleSubmitForm = async (data: any) => {
    let imageBase64: string | undefined = undefined;
    if (data.image[0]) {
      imageBase64 = await fileToBase64(data.image[0]);
    }
    const res = await editCategoryMutation.mutateAsync({
      id: String(searchParams.get('id')),
      title: data.title,
      imagePath: imageBase64,
    });
    if (res.status === 'success') {
      toast.success(res.message);
      form.reset();
      handleClose();
    } else {
      toast.error(res.message);
    }
  };

  // auto fill form
  useEffect(() => {
    if (editCategoryToggleUrlState.isShow) {
      form.reset({
        image: null,
        title: String(searchParams.get('title')),
      });
    }
  }, [editCategoryToggleUrlState.isShow]);

  return (
    <ToggleSection
      isShow={editCategoryToggleUrlState.isShow}
      isBackDrop
      onClose={handleClose}
      className="fixed left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2 sm:w-[500px]"
    >
      <div className="flex flex-col rounded-lg bg-white">
        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="flex w-full flex-col p-3"
        >
          {/* fields */}
          <div className="mb-4 mt-2 flex flex-col gap-2">
            {Object.entries(formFields).map(([key, field]) => (
              <Feild name={key} key={key} field={field} form={form} />
            ))}
          </div>
          {/* submit */}
          <button
            type="submit"
            disabled={editCategoryMutation.isPending}
            className="rounded-lg bg-teal p-4 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editCategoryMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </form>
      </div>
    </ToggleSection>
  );
}
