<template>
  <Login @submit:login="Login"></Login>
</template>

<script>
import Login from "../../components/adminComponents/Login.vue";
import EmployeesService from "../../services/employee.service"; // Sử dụng alias

export default {
  components: {
    Login,
  },
  data() {
    return {
      accountLogin: {},
    };
  },
  methods: {
    async Login(data) {
      try {
        const result = await EmployeesService.login(
          data.username,
          data.password
        );
        if (result) {
          localStorage.setItem("employee", JSON.stringify(result));
          this.$router.push("/admin");
        } else {
          window.alert("Sai tên đăng nhập hoặc mật khẩu, vui lòng nhập lại");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.message = "";
  },
};
</script>
