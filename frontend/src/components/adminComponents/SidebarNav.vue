<template>
  <aside class="sidebar">
    <div class="">
      <div class="text-center">
        <img
          class="logo mt-5"
          style="height: 52px"
          src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107"
          alt="logo"
        />
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-item" @click="navigateToManageBook">Quản lý sách</li>
        <li class="sidebar-item" @click="navigateToManagePublisher">
          Nhà xuất bản
        </li>
        <li class="sidebar-item" @click="navigateToManageBorrowBook">
          Theo dõi mượn sách
        </li>
        <li class="sidebar-item" @click="navigateToLogout">Đăng xuất</li>
      </ul>
    </div>
  </aside>
</template>
<script>
export default {
  methods: {
    navigateToManageBook() {
      this.$router.push("/admin");
    },
    navigateToManagePublisher() {
      this.$router.push("/admin/publisher");
    },
    navigateToManageBorrowBook() {
      this.$router.push("/admin/borrow-book");
    },
    navigateToLogout() {
      localStorage.removeItem("employee");
      this.$router.push("/admin/login");
    },
  },
};
</script>
<style>
ul {
  padding: 0;
  margin: 0;
}
ul > li {
  list-style-type: none;
}
.sidebar {
  background-color: #f0f0f0;
  width: 360px;
  height: 750px;
}
.sidebar-nav {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.sidebar-header {
  font-size: 20px;
  padding: 8px 30px;
  font-weight: bold;
}
.sidebar-item {
  padding: 16px 30px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.1s linear;
}
.sidebar-item:hover {
  background-color: #007bff;
  color: white;
}
</style>
