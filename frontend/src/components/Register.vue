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
      <Form @submit="submitRegister" :validation-schema="registerFormSchema">
        <div class="form-group-login">
          <Field
            name="username"
            type="text"
            class="form-input"
            v-model="registerLocal.username"
            placeholder="Tên tài khoản"
          />
          <ErrorMessage name="username" class="error-feedback" />
        </div>

        <div class="form-group-login">
          <Field
            name="email"
            type="email"
            class="form-input"
            v-model="registerLocal.email"
            placeholder="E-mail"
          />
          <ErrorMessage name="email" class="error-feedback" />
        </div>

        <div class="form-row">
          <div class="col-md-6">
            <div class="form-group-login">
              <Field
                name="password"
                type="password"
                class="form-input"
                v-model="registerLocal.password"
                placeholder="Mật khẩu"
              />
              <ErrorMessage name="password" class="error-feedback" />
            </div>
          </div>

          <div class="col-md-6">
            <div class="form-group-login">
              <Field
                name="confirm_password"
                type="password"
                class="form-input"
                v-model="registerLocal.confirm_password"
                placeholder="Xác nhận mật khẩu"
              />
              <ErrorMessage name="confirm_password" class="error-feedback" />
            </div>
          </div>
        </div>

        <!-- Additional fields -->
        <div class="form-group-login">
          <Field
            name="dateOfBirth"
            type="date"
            class="form-input"
            v-model="registerLocal.dateOfBirth"
            placeholder="Ngày sinh"
          />
          <ErrorMessage name="dateOfBirth" class="error-feedback" />
        </div>

        <div class="form-group-login">
          <Field
            as="select"
            name="gender"
            style="background: white"
            class="form-input"
            v-model="registerLocal.gender"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </Field>
          <ErrorMessage name="gender" class="error-feedback" />
        </div>

        <div class="form-group-login">
          <Field
            name="phone"
            type="text"
            class="form-input"
            v-model="registerLocal.phone"
            placeholder="Số điện thoại"
          />
          <ErrorMessage name="phone" class="error-feedback" />
        </div>

        <div class="form-group-login">
          <Field
            name="address"
            type="text"
            class="form-input"
            v-model="registerLocal.address"
            placeholder="Địa chỉ"
          />
          <ErrorMessage name="address" class="error-feedback" />
        </div>

        <!-- <div class="mb-5" style="padding-left: 30px">
          <span
            >Nếu bạn đã có tài khoản?
            <a style="color: #007bff" @click="backLogin">ĐĂNG NHẬP</a></span
          >
        </div> -->

        <div class="form-actions-login">
          <button class="btn btn-register" type="submit">ĐĂNG KÝ</button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:register"],
  data() {
    const registerFormSchema = yup.object().shape({
      email: yup
        .string()
        .email("E-mail không đúng.")
        .max(50, "E-mail tối đa 50 ký tự."),
      password: yup.string().min(6, "Mật khẩu phải từ 6 kí tự"),
      confirm_password: yup
        .string()
        .oneOf([yup.ref("password")], "Mật khẩu xác nhận không trùng khớp"),
      dateOfBirth: yup
        .date()
        .transform((originalValue, originalObject) => {
          return originalValue === "" ? new Date() : originalValue;
        })
        .required("Vui lòng chọn ngày sinh"),
      gender: yup.string().required("Vui lòng chọn giới tính"),
      phone: yup
        .string()
        .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ")
        .min(10, "Số điện thoại phải có ít nhất 10 chữ số"),
      address: yup.string().required("Vui lòng nhập địa chỉ"),
    });
    return {
      registerLocal: {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        dateOfBirth: new Date().toISOString().split("T")[0],
        gender: "",
        phone: "",
        address: "",
      },
      registerFormSchema,
    };
  },
  methods: {
    submitRegister() {
      this.$emit("submit:register", this.registerLocal);
    },
    backLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>

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

.register-title {
  font-size: 32px;
  text-align: center;
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

.form-row {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.col-md-6 {
  width: 48%;
}

.error-feedback {
  color: red;
  font-size: 0.9em;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  text-align: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.btn-register {
  font-size: 16px;
  font-weight: 400;
  color: #fff;
  padding: 12px 23px;
  border-radius: 50px;
  width: 100%;
  line-height: 1.5;
  outline: 0;
  box-shadow: none;
  background-color: rgb(39, 108, 228);
  flex: 1;
}
</style>
