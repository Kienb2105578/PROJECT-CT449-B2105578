<template>
  <div class="container">
    <Nav></Nav>
    <div class="container" id="book-detail">
      <div class="book-detail__img">
        <img :src="book.image" alt="book" />
      </div>
      <div>
        <div class="book-detail__info">
          <h4 class="book-detail__title">{{ book.name }}</h4>
          <p class="book-detail__author">Tác giả: {{ book.author }}</p>
          <p class="book-detail__price">Giá: {{ book.price }} VND</p>
          <p class="book-detail__quantity">Số lượng: {{ book.quantity }}</p>
        </div>
        <form @submit.prevent="borrowBook">
          <div class="form-date">
            <div class="date-picker">
              <label for="start-date">Ngày mượn:</label>
              <div class="input-group">
                <input
                  type="date"
                  class="form-control"
                  v-model="dataOfBorrow.dateOfBorrow"
                />
                <div class="input-group-append">
                  <div class="input-group-text bg-white h-100">
                    <i class="fa fa-calendar"></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="date-picker">
              <label for="start-date">Ngày hẹn trả:</label>
              <div class="input-group">
                <input
                  type="date"
                  class="form-control"
                  v-model="dataOfBorrow.dateOfReturn"
                />
                <div class="input-group-append">
                  <div class="input-group-text bg-white h-100">
                    <i class="fa fa-calendar"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="btn btn-outline-primary btn_submit_borrow mt-3"
          >
            Mượn sách
          </button>
        </form>
      </div>
    </div>

    <!-- Gọi Popup Component -->
    <Popup
      :showPopup="showPopup"
      :popupMessage="popupMessage"
      @close-popup="closePopup"
    />
  </div>
  <Footer></Footer>
</template>

<script>
import Nav from "../components/userComponents/NavUser.vue";
import borrowBookService from "../services/borrowBook.service";
import bookService from "../services/book.service";
import Footer from "../components/userComponents/Footer.vue";
import Popup from "../components/Popup.vue"; // Import Popup component

export default {
  components: {
    Nav,
    Footer,
    Popup, // Đăng ký component Popup
  },
  data() {
    return {
      book: {},
      dataOfBorrow: {
        dateOfBorrow: new Date().toISOString().slice(0, 10),
        dateOfReturn: new Date().toISOString().slice(0, 10),
      },
      showPopup: false, // Điều khiển popup
      popupMessage: "",
    };
  },
  methods: {
    async showBookDetail() {
      try {
        const id = this.$route.params.id;
        this.book = await bookService.getById(id);
      } catch (error) {
        console.log(error);
      }
    },

    async borrowBook() {
      try {
        const id = this.$route.params.id; // Lấy ID của sách từ URL
        const user_id = JSON.parse(localStorage.getItem("user"))?._id; // Lấy ID người dùng từ localStorage

        // Kiểm tra nếu người dùng chưa đăng nhập
        if (!user_id) {
          this.openPopup("Bạn cần đăng nhập để mượn sách");
          return;
        }

        // Kiểm tra nếu sách đã có trong bảng bookborrow và đang mượn
        const existingBorrow = await borrowBookService.getById(id); // Giả sử bạn có phương thức này để tìm sách trong bảng bookborrow

        if (
          existingBorrow &&
          (existingBorrow.status !== "Đã Trả" ||
            existingBorrow.status !== "Đã Hủy")
        ) {
          this.openPopup("Sách đã được mượn hoặc không khả dụng");
          return;
        }

        // Kiểm tra ngày mượn và ngày trả hợp lệ
        const startDate = new Date(this.dataOfBorrow.dateOfBorrow).getTime();
        const endDate = new Date(this.dataOfBorrow.dateOfReturn).getTime();

        if (startDate > endDate) {
          this.openPopup("Ngày trả phải sau ngày mượn");
          return;
        }

        // Thực hiện mượn sách
        await borrowBookService.create({
          reader_id: user_id, // Gán ID người dùng đã đăng nhập
          book_id: id,
          dateOfBorrow: new Date(this.dataOfBorrow.dateOfBorrow).toISOString(),
          dateOfReturn: new Date(this.dataOfBorrow.dateOfReturn).toISOString(),
          status: "Chờ xác nhận", // Trạng thái ban đầu khi mượn sách
        });
        this.$router.push("/borrow-book");
      } catch (error) {
        console.error(error);
        this.openPopup("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    },
    openPopup(message) {
      this.popupMessage = message;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
    },
  },
  mounted() {
    this.showBookDetail();
  },
  watch: {
    $route() {
      this.showBookDetail();
    },
  },
};
</script>

<style scoped>
.form-date {
  display: flex;
  gap: 10px;
  align-items: center;
}
.date-picker {
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-direction: column;
}

#book-detail {
  display: flex;
  gap: 20px;
  margin: 30px 0px;
  padding: 16px;
  background-color: white;
}
.book-detail__price {
  font-size: 20px;
  font-weight: bold;
  color: blue;
}
.book-detail__img > img {
  width: 360px;
  height: 520px;
  object-fit: cover;
}
.btn_submit_borrow {
  width: 30%;
  border-radius: 20px;
}

.book-detail__title {
  font-size: 40px;
  font-weight: 600;
}
.book-detail__author {
  font-size: 20px;
  font-weight: 500;
}
</style>
