<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <div class="dashboard-main">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <h3 class="title-admin">Thông tin mượn sách</h3>
        </div>

        <!-- Tìm Kiếm -->
        <div class="row mb-5">
          <div class="col-md-6"></div>
          <div class="col-md-6">
            <InputSearch
              v-model="searchText"
              placeholder="Tìm kiếm sách, người mượn..."
            />
          </div>
        </div>

        <table class="table table-hover">
          <thead>
            <tr>
              <th style="width: 5% !important">STT</th>
              <th style="width: 35% !important">Tên sách</th>
              <th style="width: 10% !important">Người mượn</th>
              <th style="width: 15% !important">Trạng Thái</th>
              <th style="width: 10% !important">Ngày mượn</th>
              <th style="width: 10% !important">Ngày hẹn trả</th>
              <th style="width: 15% !important"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedBorrowBooks" :key="item._id">
              <th scope="row">
                {{ index + 1 + (currentPage - 1) * itemsPerPage }}
              </th>
              <td>{{ item.book.name }}</td>
              <td>{{ item.reader.username }}</td>
              <td :class="getStatusClass(item)">{{ item.status }}</td>
              <td>
                {{ new Date(item.dateOfBorrow).toISOString().slice(0, 10) }}
              </td>
              <td>
                {{ new Date(item.dateOfReturn).toISOString().slice(0, 10) }}
              </td>
              <td>
                <div style="display: flex; gap: 10px">
                  <button
                    style="border-radius: 20px; border: 2px solid #007bff"
                    class="btn btn-outline-primary"
                    @click="navigateToUpdateBorrowBook(item._id)"
                  >
                    Xem chi tiết
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
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import InputSearch from "../../components/adminComponents/InputSearch.vue"; // Import InputSearch
import borrowBookService from "../../services/borrowBook.service";

export default {
  components: {
    SidebarNav,
    InputSearch,
  },
  data() {
    return {
      borrowBooks: [],
      searchText: "",
      currentPage: 1,
      itemsPerPage: 10, // Số lượng item trên mỗi trang
    };
  },
  computed: {
    filteredBorrowBooks() {
      let filtered = this.borrowBooks;

      // Tìm kiếm theo sách, người mượn và trạng thái
      if (this.searchText) {
        const search = this.searchText.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.book.name.toLowerCase().includes(search) ||
            item.reader.username.toLowerCase().includes(search) ||
            item.status.toLowerCase().includes(search)
        );
      }

      // Sắp xếp theo ngày mượn (ngày mới nhất lên đầu)
      return filtered.sort(
        (a, b) => new Date(b.dateOfBorrow) - new Date(a.dateOfBorrow)
      );
    },
    paginatedBorrowBooks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredBorrowBooks.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredBorrowBooks.length / this.itemsPerPage);
    },
  },
  methods: {
    async getAll() {
      try {
        this.borrowBooks = await borrowBookService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    navigateToUpdateBorrowBook(id) {
      this.$router.push("/admin/borrow-book/" + id);
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
      return new Date(item.dateOfReturn) < currentDate;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
  mounted() {
    this.getAll();
  },
};
</script>
