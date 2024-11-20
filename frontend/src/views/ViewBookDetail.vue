<template>
  <div class="container">
    <Nav></Nav>
    <div class="container" id="book-detail">
      <div class="book-detail__img">
        <img :src="book.image" alt="book" />
      </div>
      <div>
        <div class="row">
          <h4 class="book-detail__title">{{ book.name }}</h4>
          <div class="col-md-6">
            <div class="book-detail__info">
              <p class="book-detail__author">Tác giả: {{ book.author }}</p>
              <p class="book-detail__price">Giá: {{ book.price }} VND</p>
              <p class="book-detail__quantity">Số lượng: {{ book.quantity }}</p>
            </div>
          </div>
          <div class="col-md-6">
            <p class="book-detail__publisher mt-5">
              Nhà xuất bản: {{ publisher.name }}
            </p>
            <p class="book-detail__address">Địa chỉ: {{ publisher.address }}</p>
          </div>
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
import Popup from "../components/Popup.vue";
import publisherService from "../services/publisher.service";

export default {
  components: {
    Nav,
    Footer,
    Popup,
  },
  data() {
    return {
      book: {},
      publisher: {},
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
        console.log(this.book);
        this.publisher = await publisherService.getById(this.book.publisher);
        console.log(this.publisher);
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

        // Kiểm tra nếu sách đã có trong danh sách mượn của người dùng và có trạng thái khác "Đã Trả" hoặc "Đã Hủy"
        const existingBorrows = await borrowBookService.getAll(user_id);

        if (!existingBorrows) {
          this.openPopup(
            "Không thể lấy danh sách mượn sách. Vui lòng thử lại."
          );
        }

        // Lọc danh sách sách đang mượn (trạng thái khác "Đã Trả" hoặc "Đã Hủy")
        const borrowedBooks = existingBorrows.filter((borrow) => {
          return (
            borrow.book_id === id &&
            borrow.status !== "Đã Trả" &&
            borrow.status !== "Đã Hủy"
          );
        });

        // Nếu sách đang mượn và không khả dụng
        if (borrowedBooks.length > 0) {
          this.openPopup(`Sách này đã được mượn hoặc không khả dụng.`);
          return; // Dừng lại nếu sách đang mượn hoặc không khả dụng
        }

        // Kiểm tra xem dataOfBorrow có hợp lệ không
        if (
          !this.dataOfBorrow ||
          !this.dataOfBorrow.dateOfBorrow ||
          !this.dataOfBorrow.dateOfReturn
        ) {
          this.openPopup(
            "Dữ liệu mượn sách không hợp lệ. Vui lòng kiểm tra lại."
          );
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
        const borrowData = {
          reader_id: user_id, // Gán ID người dùng đã đăng nhập
          book_id: id,
          dateOfBorrow: new Date(this.dataOfBorrow.dateOfBorrow).toISOString(),
          dateOfReturn: new Date(this.dataOfBorrow.dateOfReturn).toISOString(),
          status: "Chờ Xác Nhận", // Trạng thái ban đầu khi mượn sách
        };

        const borrowResponse = await borrowBookService.create(borrowData);

        if (!borrowResponse) {
          this.openPopup("Lỗi khi mượn sách. Vui lòng thử lại.");
          return;
        }

        if (borrowResponse) {
          this.openPopup("Mượn sách thành công!");
          setTimeout(() => {
            this.$router.push("/borrow-book");
          }, 2000);
        }
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
  color: #007bff;
}
.book-detail__img > img {
  width: 360px;
  height: 520px;
  object-fit: cover;
}
.btn_submit_borrow {
  width: 40%;
  border-radius: 20px;
  border: 1px solid #007bff;
}

.book-detail__title {
  font-size: 32px;
  font-weight: 600;
  color: #37485a;
}
.book-detail__author {
  font-size: 20px;
  font-weight: 500;
}
</style>
