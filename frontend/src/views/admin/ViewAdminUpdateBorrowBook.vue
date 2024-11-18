<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <h3 class="text-primary mb-3">CHI TIẾT MƯỢN SÁCH</h3>
      <div v-if="!loading">
        <div class="details row">
          <!-- Thông tin sách và người mượn -->
          <div class="col-md-6">
            <!-- Thông tin người mượn -->
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

            <!-- Thông tin sách -->
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
                  <select v-model="borrowBook.status" @change="updateStatus">
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
  </div>
</template>

<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import borrowBookService from "../../services/borrowBook.service";
import bookService from "../../services/book.service";
import readerService from "../../services/reader.service";
import emailService from "../../services/email.service"; // Giả sử bạn đã có một service gửi email

export default {
  components: {
    SidebarNav,
  },
  data() {
    return {
      loading: true,
      borrowBook: {}, // Dữ liệu mượn sách
      book: null, // Chi tiết sách
      reader: null, // Chi tiết người mượn
    };
  },
  async created() {
    await this.showBorrowBook();
  },
  methods: {
    async showBorrowBook() {
      try {
        const id = this.$route.params.id;
        // Lấy dữ liệu mượn sách
        this.borrowBook = await borrowBookService.getById(id);

        // Lấy chi tiết sách dựa trên book_id
        this.book = await bookService.getById(this.borrowBook.book_id);

        // Lấy chi tiết người mượn dựa trên reader_id
        this.reader = await readerService.getById(this.borrowBook.reader_id);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chi tiết:", error);
      } finally {
        this.loading = false;
      }
    },
    async updateStatus() {
      try {
        const { _id, status } = this.borrowBook;

        // Cập nhật trạng thái mượn sách
        await borrowBookService.updateStatus(_id, { status });
        // Kiểm tra nếu trạng thái được cập nhật từ "Chờ Xác Nhận" => "Đã Xác Nhận"
        if (status === "Đã Xác Nhận") {
          // Gửi email thông báo
          await this.sendConfirmationEmail();
        }

        // Thông báo sau khi cập nhật trạng thái thành công
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

        // Gọi service gửi email
        await emailService.sendEmail(
          emailData.to,
          emailData.subject,
          emailData.text
        );
      } catch (error) {
        console.error("Lỗi khi gửi email:", error);
      }
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
</style>
