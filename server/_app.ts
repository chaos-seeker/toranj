import { router } from './trpc';
import { getAuth } from './templates/base/get-auth';
import { login } from './templates/base/login';
import { logout } from './templates/base/logout';
import { register } from './templates/base/register';
import { sendCartItems } from './routes/cart/send-cart-items';
import { addCategory } from './routes/dashboard/categories/add-category';
import { editCategory } from './routes/dashboard/categories/edit-category';
import { deleteCategory } from './routes/dashboard/categories/delete-category';
import { getDashboardOrders } from './routes/dashboard/orders/get-dashboard-orders';
import { addProduct } from './routes/dashboard/products/add-product';
import { editProduct } from './routes/dashboard/products/edit-product';
import { deleteProduct } from './routes/dashboard/products/delete-product';
import { getUsers } from './routes/dashboard/users/get-users';
import { deleteUser } from './routes/dashboard/users/delete-user';
import { changeUserRole } from './routes/dashboard/users/change-user-role';
import { getCategories } from './routes/global/get-categories';
import { getProducts } from './routes/global/get-products';
import { getProductByCategoryId } from './routes/home/get-product-by-category-id';
import { getClientOrders } from './routes/orders/get-client-orders';
import { updateAuth } from './routes/profile/update-auth';

export const appRouter = router({
  templates: router({
    base: router({
      getAuth,
      login,
      logout,
      register,
    }),
  }),
  routes: router({
    cart: router({
      sendCartItems,
    }),
    dashboard: router({
      categories: router({
        addCategory,
        editCategory,
        deleteCategory,
      }),
      orders: router({
        getDashboardOrders,
      }),
      products: router({
        addProduct,
        editProduct,
        deleteProduct,
      }),
      users: router({
        getUsers,
        deleteUser,
        changeUserRole,
      }),
    }),
    global: router({
      getCategories,
      getProducts,
    }),
    home: router({
      getProductByCategoryId,
    }),
    orders: router({
      getClientOrders,
    }),
    profile: router({
      updateAuth,
    }),
  }),
});

export type AppRouter = typeof appRouter;
