<template>
  <Login @submit:login="Login"></Login>
</template>
<script>
import Login from "../components/Login.vue";
import accountsService from "../services/accounts.service";
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
        const result = await accountsService.login(data.email, data.password);
        if (result) {
          localStorage.setItem("user", JSON.stringify(result));
          this.$router.push("/");
        } else {
          window.alert("Sai email hoặc mật khẩu vui lòng nhập lại");
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
