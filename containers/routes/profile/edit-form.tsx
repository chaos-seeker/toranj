'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { Feild } from '@/components/feild';

export function EditForm() {
  const formFields = {
    fullName: {
      label: 'نام و نام خانوادگی',
      type: 'text',
      errors: {
        least3characters: 'نام و نام خانوادگی باید حداقل 3 کاراکتر باشد!',
      },
    },
    address: {
      label: 'آدرس',
      type: 'text',
      errors: {
        least10characters: 'آدرس باید حداقل 10 کاراکتر باشد!',
      },
    },
  };
  const formSchema = z.object({
    fullName: z.string().min(3, {
      message: formFields.fullName.errors.least3characters,
    }),
    address: z.string().min(10, {
      message: formFields.address.errors.least10characters,
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      address: '',
    },
  });
  const updateAuthMutation = trpc.routes.profile.updateAuth.useMutation();
  const fetchAuth = trpc.templates.base.getAuth.useQuery();
  const handleSubmitForm = async () => {
    const res = await updateAuthMutation.mutateAsync({
      fullName: form.getValues('fullName'),
      address: form.getValues('address'),
    });
    if (res.status === 'success') {
      toast.success(res.message);
      setTimeout(() => window.location.reload(), 3000);
    } else {
      toast.error(res.message);
    }
  };
  useEffect(() => {
    if (fetchAuth.data) {
      form.reset({
        fullName: fetchAuth.data.fullName,
        address: fetchAuth.data.address,
      });
    }
  }, [fetchAuth.data]);

  return (
    <section>
      <form
        onSubmit={form.handleSubmit(handleSubmitForm)}
        className="flex w-[350px] flex-col rounded-xl border bg-white p-3 sm:w-[500px]"
      >
        {/* fields */}
        <div className="mb-4 mt-2 grid gap-2">
          {Object.entries(formFields).map(([key, field]) => (
            <Feild name={key} key={key} field={field} form={form} />
          ))}
        </div>
        {/* submit */}
        <button
          type="submit"
          disabled={updateAuthMutation.isPending}
          className="rounded-lg bg-teal p-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updateAuthMutation.isPending ? 'در حال ذخیره...' : 'ذخیره'}
        </button>
      </form>
    </section>
  );
}
