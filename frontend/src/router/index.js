// Reference from: https://router.vuejs.org/guide/advanced/navigation-guards.html
import { createRouter, createWebHistory } from "vue-router";
import { useCookieStore } from "@/stores/cookie";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const loginRequired = async (to, from, next) => {
  const { getCookie } = useCookieStore();
  const { getUser } = useUserStore();
  const { user } = storeToRefs(useUserStore());
  await getUser();
  if (user.value && getCookie("user_token")) {
    next();
  } else {
    next("/login");
  }
}

const roleRequired = (role) => 
  async (to, from, next) => {
    const { getUser } = useUserStore();
    const { user } = storeToRefs(useUserStore());
    await getUser();
    if (user.value.role === role) {
      next();
    } else {
      next("/404");
    }
  
};

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page_not_found",
    component: () => import("@/views/404/PageNotFoundView"),
  },
  {
    path: "/404",
    name: "page_not_found",
    component: () => import("@/views/404/PageNotFoundView"),
  },
  // product owner ==============================================
  {
    path: "/",
    name: "home",
    component: () => import("@/views/HomeView"),
    beforeEnter: [loginRequired, roleRequired('restaurant_owner')],
    meta: {
      isRequiredAuth: true,
    },
  },
  {
    path: "/category",
    name: "category",
    component: () => import("@/views/restuarant_owner/CategoryView"),
    beforeEnter: [loginRequired, roleRequired('restaurant_owner')],
  },
  {
    path: "/product",
    name: "product",
    component: () => import("@/views/restuarant_owner/ProductView"),
    beforeEnter: [loginRequired, roleRequired('restaurant_owner')],
  },
  {
    path: "/table",
    name: "table",
    component: () => import("@/views/restuarant_owner/TableView"),
    beforeEnter: [loginRequired, roleRequired('restaurant_owner')],
  },
  {
    path: "/staff",
    name: "staff",
    component: () => import("@/views/staff/ListStaffView"),
    beforeEnter: [loginRequired, roleRequired('restaurant_owner')],
  },
  // waiter =====================================================
  {
    path: "/waiter",
    name: "waiter",
    component: () => import("@/views/waiter/WaiterView"),
    beforeEnter: [loginRequired, roleRequired('waiter')],
  },
  {
    path: '/order-details',
    name: 'order-details',
    component: () => import('@/views/waiter/OrderDetailsView'),
    beforeEnter: [loginRequired, roleRequired('waiter')]
  },
  // Chef =======================================================
  {
    path: '/chef',
    name: '/chef',
    component: () => import('@/views/chef/ChefView'),
    beforeEnter: [loginRequired, roleRequired('chef')]
  },
  // Cashier =======================================================
  {
    path: '/cashier',
    name: '/cashier',
    component: () => import('@/views/cashier/OrdersView'),
    beforeEnter: [loginRequired, roleRequired('cashier')]
  },
  // Product Report
  {
    path: '/sale',
    name: '/sale',
    component: () => import('@/views/restuarant_owner/Product_report'),
    // beforeEnter: [loginRequired, roleRequired('product_report')]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;