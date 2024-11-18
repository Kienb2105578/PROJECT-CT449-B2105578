<template>
  <div class="container">
    <Nav></Nav>

    <!-- Chi tiết mượn sách -->
    <div v-if="selectedBook" class="book-details mt-5">
      <h4 class="text-center text-primary">CHI TIẾT MƯỢN SÁCH</h4>
      <div class="row m-5">
        <div class="col-md-4 text-center">
          <img
            :src="selectedBook.book.image"
            alt="Ảnh sách"
            class="book-image"
          />
          <p class="m-4">{{ selectedBook.book.author }}</p>
        </div>
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6">
              <p><strong>Tên sách:</strong> {{ selectedBook.book.name }}</p>
              <p>
                <strong>Ngày mượn:</strong>
                {{ formatDate(selectedBook.dateOfBorrow) }}
              </p>
              <p>
                <strong>Ngày hẹn trả:</strong>
                {{ formatDate(selectedBook.dateOfReturn) }}
              </p>
              <p style="font-weight: bold">
                <strong>Trạng thái: </strong>
                <span :class="getStatusClass(selectedBook)">
                  {{ selectedBook.status }}
                </span>
                <span v-if="isOverdue(selectedBook)" class="text-danger">
                  (Trễ hạn)</span
                >
              </p>
            </div>
            <div class="col-md-6">
              <p>
                <strong>Người mượn:</strong> {{ selectedBook.reader.username }}
              </p>
              <p><strong>Email:</strong> {{ selectedBook.reader.email }}</p>
              <p>
                <strong>Số điện thoại:</strong>
                {{ selectedBook.reader.phone }}
              </p>
            </div>
          </div>
          <div class="row text-center mt-5">
            <button
              v-if="showCancelButton(selectedBook)"
              class="btn btn-outline-danger btn-sm"
              style="border: 1px solid red"
              @click="cancelBorrow(selectedBook)"
            >
              Hủy mượn
            </button>
          </div>
        </div>
      </div>
    </div>

    <h3 class="text-center text-primary" style="padding: 20px 0 0 20px">
      LỊCH SỬ
    </h3>

    <!-- Bảng lịch sử mượn sách -->
    <div id="product_h">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th style="width: 5%">STT</th>
            <th style="width: 41%">Tên sách</th>
            <th style="width: 15%">Trạng thái</th>
            <th style="width: 12%">Ngày mượn</th>
            <th style="width: 12%">Ngày hẹn trả</th>
            <th style="width: 15%"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in borrowBook" :key="item._id">
            <td>{{ index + 1 }}</td>
            <td @click="showBookDetails(item)" class="book-name">
              {{ item.book.name }}
            </td>
            <td :class="getStatusClass(item)">
              {{ item.status }}
              <span v-if="isOverdue(item)" class="text-danger"> (Trễ hạn)</span>
            </td>
            <td>{{ formatDate(item.dateOfBorrow) }}</td>
            <td>{{ formatDate(item.dateOfReturn) }}</td>
            <td class="text-center" @click="showBookDetails(item)">
              <button class="btn btn-outline-primary primary-outline">
                Xem chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import Nav from "../components/userComponents/NavUser.vue";
import borrowBookService from "../services/borrowBook.service";
import Footer from "../components/userComponents/Footer.vue";

export default {
  components: {
    Nav,
    Footer,
  },
  data() {
    return {
      borrowBook: [],
      selectedBook: null,
    };
  },
  methods: {
    async getAll() {
      try {
        const user_id = JSON.parse(localStorage.getItem("user"))._id;
        const query = { user_id };
        const params = new URLSearchParams(query);
        const queryString = params.toString();
        this.borrowBook = await borrowBookService.getAll(queryString);
      } catch (error) {
        console.log(error);
      }
    },
    showBookDetails(item) {
      this.selectedBook = item;
    },
    formatDate(date) {
      return new Date(date).toISOString().slice(0, 10);
    },
    getStatusClass(item) {
      if (item.status === "Đang Mượn" && this.isOverdue(item)) {
        return "text-danger";
      }
      if (item.status === "Đã Trả") {
        return "text-success";
      }
      if (item.status === "Đã Xác Nhận") {
        return "text-primary";
      }
      if (item.status === "Đã Hủy") {
        return "text-secondary";
      }
      return "";
    },
    isOverdue(item) {
      const currentDate = new Date();
      const returnDate = new Date(item.dateOfReturn);
      return item.status === "Đang Mượn" && currentDate > returnDate;
    },
    showCancelButton(item) {
      return item.status === "Chờ Xác Nhận" || item.status === "Đã Xác Nhận";
    },
    async cancelBorrow(item) {
      try {
        await borrowBookService.updateStatus(item._id, { status: "Đã Hủy" });
        this.getAll();
      } catch (error) {
        console.log("Hủy mượn thất bại:", error);
      }
    },
  },
  mounted() {
    this.getAll();
  },
};
</script>
<style scoped>
.table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 15px;
  text-align: left;
  border: 1px solid #ddd;
}

.primary-outline {
  border-radius: 20px;
  text-align: center;
  border: 1px solid #007bff;
}
.book-name:hover {
  color: blue;
}

.text-danger {
  color: red !important;
}

.text-success {
  color: green !important;
}

.text-secondary {
  color: gray !important;
}

.book-details {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.book-image {
  max-width: 90%;
  height: auto;
  border-radius: 20px;
}
</style>
