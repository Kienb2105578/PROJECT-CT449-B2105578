import { createWebHistory, createRouter } from "vue-router";

import ViewHome from "../views/ViewHome.vue";
import ViewLogin from "../views/ViewLogin.vue";
import ViewRegister from "../views/ViewRegister.vue";
import ViewBookDetail from "../views/ViewBookDetail.vue";
import ViewBorrowBook from "../views/ViewBorrowBook.vue";

import ViewModifyPublisher from "../views/admin/ViewAdminAddPublisher.vue";
import ViewUpdatePublisher from "../views/admin/ViewAdminUpdatePublisher.vue";
import ViewAdminHome from "../views/admin/ViewAdminHome.vue";
import ViewAdminLogin from "../views/admin/ViewAdminLogin.vue";
import ViewAdminPublisher from "../views/admin/ViewAdminPublisher.vue";
import ViewAdminAddBook from "../views/admin/ViewAdminAddBook.vue";
import ViewAdminUpdateBook from "../views/admin/ViewAdminUpdateBook.vue";
import ViewAdminBorrowBook from "../views/admin/ViewAdminBorrowBook.vue";
import ViewAdminUpdateBorrowBook from "../views/admin/ViewAdminUpdateBorrowBook.vue";
import ViewInputSearch from "../views/admin/ViewInputSearch.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: ViewHome,
  },
  {
    path: "/login",
    name: "login",
    component: ViewLogin,
  },
  {
    path: "/register",
    name: "register",
    component: ViewRegister,
  },
  {
    path: "/:id",
    name: "book-detail",
    component: ViewBookDetail,
  },
  {
    path: "/borrow-book",
    name: "borrow-book",
    component: ViewBorrowBook,
  },
  {
    path: "/admin",
    name: "view-admin-home",
    component: ViewAdminHome,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/login",
    name: "view-admin-login",
    component: ViewAdminLogin,
  },
  {
    path: "/admin/publisher",
    name: "view-admin-publisher",
    component: ViewAdminPublisher,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/publisher/create",
    name: "view-admin-publisher-create",
    component: ViewModifyPublisher,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/publisher/:id",
    name: "view-admin-publisher-update",
    component: ViewUpdatePublisher,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/borrow-book/:id",
    name: "view-admin-borrowbook-update",
    component: ViewAdminUpdateBorrowBook,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/book/create",
    name: "view-admin-book-create",
    component: ViewAdminAddBook,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/book/:id",
    name: "view-admin-book-update",
    component: ViewAdminUpdateBook,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/admin/borrow-book",
    name: "view-admin-borrow-book",
    component: ViewAdminBorrowBook,
    meta: { requiresAuth: true }, // Cần xác thực
  },
  {
    path: "/search",
    name: "search",
    component: ViewInputSearch, // Bạn có thể dùng ViewHome hoặc tạo một component riêng để hiển thị kết quả tìm kiếm
    props: (route) => ({ query: route.query.q }), // Truyền query 'q' từ URL vào component
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
export default router;
