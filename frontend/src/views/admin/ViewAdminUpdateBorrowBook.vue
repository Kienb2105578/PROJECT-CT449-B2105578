<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <h3 class="text-primary mb-3">CHI TIẾT MƯỢN SÁCH</h3>
      <div v-if="!loading">
        <div class="details row">
          <!-- Thông tin sách và người mượn -->
          <div class="col-md-6">
            <div class="info-section mb-4" v-if="reader">
              <h4>Thông tin người mượn</h4>
              <div class="info-row">
                <div class="info-label"><strong>Tên người mượn:</strong></div>
                <div class="info-value">{{ reader.username }}</div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Email:</strong></div>
                <div class="info-value">{{ reader.email }}</div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Số điện thoại:</strong></div>
                <div class="info-value">{{ reader.phone }}</div>
              </div>
            </div>

            <div class="info-section" v-if="book">
              <h4>Thông tin sách</h4>
              <div class="info-row">
                <div class="info-label"><strong>Tên sách:</strong></div>
                <div class="info-value">{{ book.name }}</div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Tác giả:</strong></div>
                <div class="info-value">{{ book.author }}</div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Giá:</strong></div>
                <div class="info-value text-primary">{{ book.price }} VNĐ</div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Ngày mượn:</strong></div>
                <div class="info-value">
                  {{ formattedDate(borrowBook.dateOfBorrow) }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Ngày hẹn trả:</strong></div>
                <div class="info-value">
                  {{ formattedDate(borrowBook.dateOfReturn) }}
                </div>
              </div>
              <div class="info-row">
                <div class="info-label"><strong>Trạng thái:</strong></div>
                <div class="info-value">
                  <select
                    class="choser"
                    v-model="borrowBook.status"
                    @change="updateStatus"
                  >
                    <option value="Chờ Xác Nhận">Chờ Xác Nhận</option>
                    <option value="Đã Xác Nhận">Đã Xác Nhận</option>
                    <option value="Đang Mượn">Đang Mượn</option>
                    <option value="Đã Trả">Đã Trả</option>
                    <option value="Đã Hủy">Hủy Mượn</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Ảnh sách (col-md-6) -->
          <div class="col-md-6">
            <div class="info-row text-center">
              <img :src="book.image" alt="Book Image" class="book-image" />
            </div>
          </div>
        </div>
      </div>
      <p v-else>Không tìm thấy thông tin mượn sách</p>
    </div>

    <Popup
      :showPopup="showPopup"
      :popupMessage="popupMessage"
      @close-popup="closePopup"
    />
  </div>
</template>
<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import borrowBookService from "../../services/borrowBook.service";
import bookService from "../../services/book.service";
import readerService from "../../services/reader.service";
import emailService from "../../services/email.service";
import Popup from "../../components/Popup.vue";

export default {
  components: {
    SidebarNav,
    Popup,
  },
  data() {
    return {
      loading: true,
      borrowBook: {},
      book: null,
      reader: null,
      showPopup: false,
      popupMessage: "",
    };
  },
  async created() {
    await this.fetchBorrowBookData();
  },
  methods: {
    async fetchBorrowBookData() {
      try {
        const id = this.$route.params.id;
        this.borrowBook = await borrowBookService.getById(id);
        this.book = await bookService.getById(this.borrowBook.book_id);
        this.reader = await readerService.getById(this.borrowBook.reader_id);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
      } finally {
        this.loading = false;
      }
    },
    canChangeStatus(currentStatus, newStatus) {
      const validTransitions = {
        "Chờ Xác Nhận": ["Đã Xác Nhận", "Đã Hủy"],
        "Đã Xác Nhận": ["Đang Mượn", "Đã Hủy"],
        "Đang Mượn": ["Đã Trả"],
        "Đã Trả": [],
        "Đã Hủy": [],
      };

      console.log(
        "Kiểm tra sự chuyển đổi trạng thái: ",
        currentStatus,
        " -> ",
        newStatus
      );

      // Kiểm tra sự chuyển đổi hợp lệ từ trạng thái hiện tại sang trạng thái mới
      return validTransitions[currentStatus]?.includes(newStatus);
    },

    async updateStatus(event) {
      try {
        const id = this.$route.params.id;
        this.borrowBook = await borrowBookService.getById(id);

        const currentStatus = this.borrowBook.status;
        const newStatus = event.target.value;

        if (this.canChangeStatus(currentStatus, newStatus)) {
          this.borrowBook.status = newStatus;
          await borrowBookService.updateStatus(id, { status: newStatus });

          if (newStatus === "Đã Xác Nhận") {
            await this.sendConfirmationEmail();
          }
        } else {
          this.openPopup("Không thể thay đổi trạng thái này.");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
      }
    },
    async sendConfirmationEmail() {
      try {
        const emailData = {
          to: this.reader.email,
          subject: "Thông báo xác nhận mượn sách",
          text: `
            Chào ${this.reader.username},

            Chúng tôi xin thông báo rằng yêu cầu mượn sách của bạn đã được xác nhận.
            Bạn có thể đến nhận sách tại thư viện vào ngày ${this.formattedDate(
              this.borrowBook.dateOfBorrow
            )}.

            Trân trọng,
            Thư viện của chúng tôi
          `,
        };
        await emailService.sendEmail(
          emailData.to,
          emailData.subject,
          emailData.text
        );
      } catch (error) {
        console.error("Lỗi khi gửi email:", error);
      }
    },

    openPopup(message) {
      this.popupMessage = message;
      this.showPopup = true;
    },

    closePopup() {
      this.showPopup = false;
    },

    formattedDate(date) {
      return new Date(date).toLocaleDateString("vi-VN");
    },
  },
};
</script>

<style scoped>
.details {
  display: flex;
  flex-wrap: wrap;
}

.info-section {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.info-label {
  font-weight: bold;
  width: 40%;
}

.info-value {
  width: 55%;
  word-wrap: break-word;
}

.book-image {
  max-width: 100%;
  height: 400px;
  margin-top: 1rem;
}
.choser {
  width: 60%;
  padding: 5px;
  text-align: center;
}
</style>
