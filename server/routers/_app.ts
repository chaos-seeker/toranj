import { router } from '../trpc';
import { getAuthRouter } from './templates/base/get-auth';
import { loginRouter } from './templates/base/login';
import { logoutRouter } from './templates/base/logout';
import { registerRouter } from './templates/base/register';
import { sendCartItemsRouter } from './routes/cart/send-cart-items';
import { addCategoryRouter } from './routes/dashboard/categories/add-category';
import { editCategoryRouter } from './routes/dashboard/categories/edit-category';
import { deleteCategoryRouter } from './routes/dashboard/categories/delete-category';
import { getDashboardOrdersRouter } from './routes/dashboard/orders/get-dashboard-orders';
import { addProductRouter } from './routes/dashboard/products/add-product';
import { editProductRouter } from './routes/dashboard/products/edit-product';
import { deleteProductRouter } from './routes/dashboard/products/delete-product';
import { getUsersRouter } from './routes/dashboard/users/get-users';
import { deleteUserRouter } from './routes/dashboard/users/delete-user';
import { changeUserRoleRouter } from './routes/dashboard/users/change-user-role';
import { getCategoriesRouter } from './routes/global/get-categories';
import { getProductsRouter } from './routes/global/get-products';
import { getProductByCategoryIdRouter } from './routes/home/get-product-by-category-id';
import { getClientOrdersRouter } from './routes/orders/get-client-orders';
import { updateAuthRouter } from './routes/profile/update-auth';

export const appRouter = router({
  templates: router({
    base: router({
      getAuth: getAuthRouter,
      login: loginRouter,
      logout: logoutRouter,
      register: registerRouter,
    }),
  }),
  routes: router({
    cart: router({
      sendCartItems: sendCartItemsRouter,
    }),
    dashboard: router({
      categories: router({
        addCategory: addCategoryRouter,
        editCategory: editCategoryRouter,
        deleteCategory: deleteCategoryRouter,
      }),
      orders: router({
        getDashboardOrders: getDashboardOrdersRouter,
      }),
      products: router({
        addProduct: addProductRouter,
        editProduct: editProductRouter,
        deleteProduct: deleteProductRouter,
      }),
      users: router({
        getUsers: getUsersRouter,
        deleteUser: deleteUserRouter,
        changeUserRole: changeUserRoleRouter,
      }),
    }),
    global: router({
      getCategories: getCategoriesRouter,
      getProducts: getProductsRouter,
    }),
    home: router({
      getProductByCategoryId: getProductByCategoryIdRouter,
    }),
    orders: router({
      getClientOrders: getClientOrdersRouter,
    }),
    profile: router({
      updateAuth: updateAuthRouter,
    }),
  }),
});

export type AppRouter = typeof appRouter;
