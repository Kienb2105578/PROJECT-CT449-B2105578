<template>
  <div class="container login-body">
    <div class="register-container">
      <div class="text-center">
        <img
          class="logo mb-5"
          style="height: 52px"
          src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107"
          alt="logo"
        />
      </div>
      <Form @submit="submitLogin" :validation-schema="loginFormSchema">
        <div class="form-group-login">
          <Field
            name="email"
            type="email"
            class="form-input"
            v-model="loginLocal.email"
            placeholder="E-mail"
          />
          <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="form-group-login">
          <Field
            name="password"
            type="password"
            class="form-input"
            v-model="loginLocal.password"
            placeholder="Mật khẩu"
          />
          <ErrorMessage name="password" class="error-feedback" />
        </div>

        <!-- <div class="form-group form-check">
          <input name="favorite" type="checkbox" class="form-check-input" />
          <label for="favorite" class="form-check-label">
            <strong>Lưu mật khẩu</strong>
          </label>
        </div> -->

        <div class="mb-5" style="padding-left: 30px">
          <span>
            Bạn chưa có tài khoản?
            <a style="color: #007bff" @click="gotoRegister">ĐĂNG KÝ</a>
          </span>
        </div>

        <div class="form-actions-login">
          <button class="btn btn-register" type="submit">ĐĂNG NHẬP</button>
        </div>
      </Form>
    </div>
  </div>
</template>

<style scoped>
.login-body {
  width: 814px;
  min-height: 640px;
  margin-top: 30px;
  background: #e5e2e2;
  box-shadow: 0 0 50px rgba(167, 171, 183, 0.03);
  border-radius: 30px;
  padding: 50px 42px 38px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-container {
  width: 100%;
  max-width: 500px;
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group {
  font-size: 16px;
  font-weight: 400;
  color: #333;
  border: none; /* Không có viền */
  padding: 12px 23px;
  border-radius: 50px;
  width: 100%;
  line-height: 1.5;
  outline: 0;
  box-shadow: none;
  background: #fff;
}
.form-input {
  border: none;
  outline: none;
  width: 100%;
  padding: 10px;
}

.form-group:focus-within {
  border: 1px solid #007bff;
  box-shadow: 0 0 5px rgba(0, 0, 255, 0.5);
}

.form-group::placeholder {
  color: transparent;
}

.form-input:not(:placeholder-shown) {
  font-size: 16px;
  color: #888;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label {
  font-size: 12px;
  color: #4caf50;
}

.error-feedback {
  color: red;
  font-size: 0.9em;
}

.form-actions {
  display: flex;
  justify-content: center;
  text-align: center;
}

.btn {
  padding: 12px 23px;
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  border-radius: 50px;
  width: 100%;
  background-color: rgb(39, 108, 228);
  flex: 1;
}
</style>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:login"],
  data() {
    const loginFormSchema = yup.object().shape({
      email: yup
        .string()
        .email("E-mail không đúng.")
        .max(50, "E-mail tối đa 50 ký tự."),
      password: yup.string().min(6, "Mật khẩu phải từ 6 kí tự"),
    });
    return {
      loginLocal: {},
      loginFormSchema,
    };
  },
  methods: {
    submitLogin() {
      console.log("submitLogin", this.loginLocal);
      this.$emit("submit:login", this.loginLocal);
    },
    gotoRegister() {
      this.$router.push("/register");
    },
  },
};
</script>
