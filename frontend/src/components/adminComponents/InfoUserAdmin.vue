<template>
  <div>
    <h3>Dashboard Admin</h3>
    <div class="dashboard-main__info" v-if="employee">
      <h4>Thông tin</h4>
      <div>
        <p>ID: {{ employee._id }}</p>
        <p>Tên người dùng: {{ employee.username }}</p>
        <p>SĐT: {{ employee.phone }}</p>
      </div>
    </div>
    <div v-else>
      <p>Vui lòng đăng nhập để xem thông tin.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      employee: null,
    };
  },
  mounted() {
    const employeeData = JSON.parse(localStorage.getItem("employee"));
    if (employeeData) {
      this.employee = employeeData;
    } else {
      this.$router.push("/admin/login");
    }
  },
};
</script>

<style scoped>
.dashboard-main__info {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  margin-top: 20px;
}
</style>
