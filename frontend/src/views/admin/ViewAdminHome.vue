<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <div class="dashboard-main__table">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <h3 class="title-admin">Thông tin sách</h3>
        </div>
        <div>
          <button
            class="btn btn-outline-primary m-2 add-button"
            @click="navigateToCreateBook"
          >
            Thêm mới
          </button>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên sách</th>
              <th scope="col">Tác giả</th>
              <th scope="col">Nhà xuất bản</th>
              <th scope="col">Số lượng</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in books" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.author }}</td>
              <td>{{ getPublisherName(item.publisher) }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <div style="display: flex; gap: 10px">
                  <button
                    class="btn btn-primary"
                    @click="navigateToUpdateBook(item._id)"
                  >
                    Sửa
                  </button>
                  <button class="btn btn-danger" @click="deleteBook(item._id)">
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import bookService from "../../services/book.service";
import publisherService from "../../services/publisher.service"; // Giả sử bạn có service này

export default {
  components: {
    SidebarNav,
  },
  data() {
    return {
      books: [],
      publishers: [], // Mảng lưu thông tin nhà xuất bản
    };
  },
  methods: {
    async getAll() {
      try {
        this.books = await bookService.getAll();
        // Lấy danh sách nhà xuất bản
        this.publishers = await publisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteBook(id) {
      try {
        await bookService.delete(id);
        this.books = this.books.filter((item) => item._id !== id);
      } catch (error) {
        console.log(error);
      }
    },
    navigateToCreateBook() {
      this.$router.push("/admin/book/create");
    },
    navigateToUpdateBook(id) {
      this.$router.push("/admin/book/" + id);
    },
    getPublisherName(publisherId) {
      const publisher = this.publishers.find((p) => p._id === publisherId);
      return publisher ? publisher.name : "Chưa xác định";
    },
  },
  mounted() {
    const employee = JSON.parse(localStorage.getItem("employee"));
    if (!employee) {
      this.$router.push("/admin/login");
    } else {
      this.getAll();
    }
  },
};
</script>

<style>
.main {
  background-color: white;
}
.dashboard-main__table {
  margin-top: 30px;
}
.dashboard-main__info {
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  margin-top: 20px;
  width: 100%;
}
.dashboard-main__info > div {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
ul {
  padding: 0;
  margin: 0;
}
ul > li {
  list-style-type: none;
}
.dashboard {
  display: flex;
  height: 100%;
}

.main {
  padding: 20px;
  width: 100%;
}
.dashboard-main__table table {
  width: 100%;
}

.dashboard-main__table th,
.dashboard-main__table td {
  text-align: left;
  padding: 8px;
}

.dashboard-main__table th:nth-child(1),
.dashboard-main__table td:nth-child(1) {
  width: 5%; /* ID */
}

.dashboard-main__table th:nth-child(2),
.dashboard-main__table td:nth-child(2) {
  width: 30%; /* Tên sách */
}

.dashboard-main__table th:nth-child(3),
.dashboard-main__table td:nth-child(3) {
  width: 15%; /* Tác giả */
}

.dashboard-main__table th:nth-child(4),
.dashboard-main__table td:nth-child(4) {
  width: 20%; /* Nhà xuất bản */
}

.dashboard-main__table th:nth-child(5),
.dashboard-main__table td:nth-child(5) {
  width: 15%; /* Số lượng */
}

.dashboard-main__table th:nth-child(6),
.dashboard-main__table td:nth-child(6) {
  width: 15%; /* Các hành động như sửa và xóa */
}
</style>
