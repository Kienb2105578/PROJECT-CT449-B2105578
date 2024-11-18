<template>
  <div>
    <Form @submit="handleSubmit" class="main-form">
      <div class="form-group">
        <label for="image">Hình ảnh</label>
        <Field
          type="text"
          class="form-control"
          id="image"
          placeholder="Nhập url hình ảnh"
          name="image"
          v-model="data.image"
        />
        <ErrorMessage name="image" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="name">Tên</label>
        <Field
          type="text"
          class="form-control"
          id="name"
          placeholder="Nhập tên sách"
          name="name"
          v-model="data.name"
        />
        <ErrorMessage name="name" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="author">Tác giả</label>
        <Field
          type="text"
          class="form-control"
          id="author"
          placeholder="Nhập tên tác giả"
          name="author"
          v-model="data.author"
        />
        <ErrorMessage name="author" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="quantity">Số lượng</label>
        <Field
          type="text"
          class="form-control"
          id="quantity"
          placeholder="Nhập số lượng sách"
          name="quantity"
          v-model="data.quantity"
        />
        <ErrorMessage name="quantity" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="price">Giá</label>
        <Field
          type="text"
          class="form-control"
          id="price"
          placeholder="Nhập giá tiền"
          name="price"
          v-model="data.price"
        />
        <ErrorMessage name="price" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="publishYear">Năm xuất bản</label>
        <Field
          type="text"
          class="form-control"
          id="publishYear"
          placeholder="Nhập năm xuất bản"
          name="publishYear"
          v-model="data.publishYear"
        />
        <ErrorMessage name="publishYear" class="error-feedback" />
      </div>
      <div class="form-group">
        <label for="publisher">Nhà xuất bản</label>
        <select
          id="publisher"
          name="publisher"
          v-model="data.publisher"
          class="form-select"
          aria-label="Default select example"
        >
          <option disabled value="">Chọn nhà xuất bản:</option>
          <option v-for="item in publishers" :value="item._id">
            {{ item.name }}
          </option>
        </select>
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
import bookService from "../../services/book.service";
import publisherService from "../../services/publisher.service";
export default {
  props: {
    book: {
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
      publishers: [],
      data:
        Object.keys(this.book).length > 0
          ? {
              _id: this.book._id,
              name: this.book.name,
              author: this.book.author,
              quantity: this.book.quantity,
              publisher: this.book.publisher,
              price: this.book.price,
              publishYear: this.book.publishYear,
              image: this.book.image || "https://picsum.photos/200/300",
            }
          : {
              _id: "",
              name: "",
              author: "",
              quantity: "",
              publisher: "",
              price: 0,
              publishYear: 2000,
              image: "",
            },
    };
  },
  methods: {
    async getAll() {
      try {
        this.publishers = await publisherService.getAll();
        console.log(Boolean(this.book) ? "y" : "no");
      } catch (error) {
        console.log(error);
      }
    },
    async handleSubmit() {
      try {
        const { _id, ...newData } = this.data;

        if (!newData.publisher) {
          window.alert("Chưa chọn nhà xuất bản");
          return;
        }

        if (this.book._id) {
          await bookService.update(_id, newData);
        } else {
          await bookService.create(newData);
        }
        this.$router.push("/admin/");
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.getAll();
  },
};
</script>
