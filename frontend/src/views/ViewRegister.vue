<template>
  <div>
    <Register @submit:register="register"></Register>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import Register from "../components/Register.vue";
import accountsService from "../services/accounts.service";

export default {
  components: {
    Register,
  },
  data() {
    return {
      account: {},
      errorMessage: "",
    };
  },
  methods: {
    async register(data) {
      try {
        if (data.password !== data.confirm_password) {
          this.errorMessage = "Mật khẩu xác nhận không trùng khớp";
        }
        const result = await accountsService.register(data);
        if (result) {
          this.$router.push("/login");
        } else {
          this.errorMessage = "Đăng ký thất bại";
        }
      } catch (error) {
        this.errorMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.";
      }
    },
  },
  created() {
    this.message = "";
  },
};
</script>

<style scoped>
.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>
