import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { Feild } from '@/components/feild';
import { ToggleSection } from '@/components/toggle-section';
import { useToggleUrlState } from '@/hooks/toggle-url-state';

export function ModalRegister() {
  const loginToggleUrlState = useToggleUrlState('login');
  const registerToggleUrlState = useToggleUrlState('register');
  const handleShowModalLogin = () => {
    registerToggleUrlState.hide();
    loginToggleUrlState.show();
  };
  const handleCloseModalRegister = () => {
    registerToggleUrlState.hide();
  };

  const formFields = {
    fullName: {
      label: 'نام و نام خانوادگی',
      type: 'text',
      errors: {
        least3characters: 'نام و نام خانوادگی باید حداقل 3 کاراکتر باشد!',
      },
    },
    phoneNumber: {
      label: 'شماره موبایل',
      type: 'number',
      errors: {
        isNotCorrect: 'شماره موبایل وارد شده معتبر نیست!',
      },
    },
    password: {
      label: 'رمز عبور',
      type: 'password',
      errors: {
        least8characters: 'رمز عبور باید حداقل 8 کاراکتر باشد!',
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
    phoneNumber: z.string().regex(new RegExp(/^0\d{10}$/), {
      message: formFields.phoneNumber.errors.isNotCorrect,
    }),
    password: z.string().min(8, {
      message: formFields.password.errors.least8characters,
    }),
    address: z.string().min(10, {
      message: formFields.address.errors.least10characters,
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      password: '',
      address: '',
    },
  });
  const registerMutation = trpc.templates.base.register.useMutation();
  const handleSubmitForm = async () => {
    const res = await registerMutation.mutateAsync({
      fullName: form.getValues('fullName'),
      phoneNumber: form.getValues('phoneNumber'),
      password: form.getValues('password'),
      address: form.getValues('address'),
    });
    if (res.status === 'success') {
      toast.success(res.message);
      loginToggleUrlState.hide();
      setTimeout(() => window.location.reload(), 3000);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <ToggleSection
      isShow={registerToggleUrlState.isShow}
      isBackDrop
      onClose={handleCloseModalRegister}
      className="fixed left-1/2 top-1/2 w-[350px] -translate-x-1/2 -translate-y-1/2 sm:w-[500px]"
    >
      <div className="flex flex-col rounded-lg bg-white">
        {/* head */}
        <div className="flex w-full justify-between border-b p-2">
          <button
            onClick={handleShowModalLogin}
            className="w-1/2 px-6 py-3 text-center text-teal"
          >
            ورود
          </button>
          <p className="w-1/2 rounded-lg bg-teal px-6 py-3 text-center text-white">
            ثبت نام
          </p>
        </div>
        {/* body */}
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
            disabled={registerMutation.isPending}
            className="rounded-lg bg-teal p-4 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? 'در حال ثبت نام...' : 'ثبت نام'}
          </button>
        </form>
      </div>
    </ToggleSection>
  );
}
