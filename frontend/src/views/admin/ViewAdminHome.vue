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
        <div class="row mb-4">
          <div class="col-md-6">
            <button
              class="btn btn-outline-primary m-2 add-button"
              @click="navigateToCreateBook"
            >
              Thêm mới
            </button>
          </div>

          <div class="col-md-6">
            <InputSearch v-model="searchText" />
          </div>
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
            <tr v-for="(item, index) in paginatedBooks" :key="item._id">
              <th scope="row">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </th>
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

        <!-- Phân trang -->
        <div class="d-flex justify-content-center">
          <nav>
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                  class="page-link"
                  href="#"
                  @click="changePage(currentPage - 1)"
                >
                  &laquo;
                </a>
              </li>
              <li
                class="page-item"
                v-for="page in totalPages"
                :key="page"
                :class="{ active: page === currentPage }"
              >
                <a class="page-link" href="#" @click="changePage(page)">{{
                  page
                }}</a>
              </li>
              <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
              >
                <a
                  class="page-link"
                  href="#"
                  @click="changePage(currentPage + 1)"
                >
                  &raquo;
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputSearch from "../../components/adminComponents/InputSearch.vue";
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import bookService from "../../services/book.service";
import publisherService from "../../services/publisher.service";

export default {
  components: {
    SidebarNav,
    InputSearch,
  },
  data() {
    return {
      books: [],
      publishers: [],
      searchText: "", // Giá trị dùng để tìm kiếm
      currentPage: 1, // Trang hiện tại
      itemsPerPage: 5, // Số lượng sách mỗi trang
    };
  },
  computed: {
    filteredBooks() {
      if (!this.searchText) return this.books;
      const search = this.searchText.toLowerCase();
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          this.getPublisherName(book.publisher).toLowerCase().includes(search)
      );
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = this.currentPage * this.itemsPerPage;
      return this.filteredBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage);
    },
  },
  methods: {
    async getAll() {
      try {
        this.books = await bookService.getAll();
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
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
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
