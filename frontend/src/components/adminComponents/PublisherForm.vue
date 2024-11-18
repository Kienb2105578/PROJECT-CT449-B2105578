<template>
  <div v-if="publisher">
    <Form @submit="handleSubmit" class="main-form">
      <div class="form-group">
        <label for="name">Tên</label>
        <Field
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập tên nhà xuất bản"
          name="name"
          v-model="data.name"
        />
        <ErrorMessage name="name" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="address">Địa chỉ</label>
        <Field
          type="text"
          class="form-control"
          id="address"
          placeholder="Nhập địa chỉ"
          name="address"
          v-model="data.address"
        />
        <ErrorMessage name="address" class="error-feedback" />
      </div>
      <button class="btn btn-primary" type="submit">Lưu</button>
    </Form>
  </div>
</template>

<style>
.main-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>

<script>
import { Form, Field, ErrorMessage } from "vee-validate";
import publisherService from "../../services/publisher.service";
export default {
  props: {
    publisher: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    return {
      data: this.publisher || {
        _id: "",
        name: "",
        address: "",
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const { _id, ...newData } = this.data;
        if (this.publisher._id) {
          await publisherService.update(_id, newData);
        } else {
          await publisherService.create(newData);
        }
        this.$router.push("/admin/publisher");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
