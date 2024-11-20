<template>
  <div class="container">
    <!-- NavBar -->
    <div class="nav-home container">
      <div class="nav-home-navbar container">
        <div id="logo" class="text-center">
          <router-link style="text-decoration: none" to="/">
            <img
              class="logo"
              style="height: 40px"
              src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107"
              alt="logo"
            />
          </router-link>
        </div>

        <div class="btn_nav" style="width: 100%">
          <ul class="nav justify-content-end">
            <li class="nav-item">
              <div>
                <router-link to="/">Trang chủ</router-link>
              </div>
            </li>
            <li class="nav-item">
              <div v-if="loggedIn">
                <router-link to="/borrow-book">Lịch sử</router-link>
              </div>
            </li>
            <li class="nav-item">
              <div v-if="loggedIn">
                <button @click="handleLogout">Đăng xuất</button>
              </div>
            </li>
            <li class="nav-item">
              <div v-if="!loggedIn">
                <button @click="navigateToLogin">Đăng nhập</button>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div class="nav-home-navbar container text-center">
        <div class="search-group d-flex justify-content-center">
          <!-- Thay thế phần tìm kiếm hiện tại bằng InputSearch -->
          <InputSearch v-model="searchText" @search="handleSearchBook" />
        </div>
      </div>
    </div>

    <!-- Nội dung chính -->
    <div class="mb-5" id="product_h">
      <!-- Hiển thị danh sách sách -->
      <div v-if="isLoading" class="loading">Đang tải...</div>

      <div v-else class="book-list">
        <div
          class="book-item"
          v-for="item in paginatedBooks"
          :key="item._id"
          @click="navigateToBook(item._id)"
        >
          <div>
            <div class="book-item__img">
              <img :src="item.image" alt="book" />
            </div>
            <div class="book-item__info">
              <div class="book-item__author">by {{ item.author }}</div>
              <h4 class="book-item__title">{{ item.name }}</h4>
            </div>
          </div>
          <button class="btn btn-outline-primary book-item__btn m-4">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>

    <!-- Phân trang -->
    <div class="d-flex justify-content-center mb-5">
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click="changePage(currentPage - 1)">
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
            <a class="page-link" href="#" @click="changePage(currentPage + 1)">
              &raquo;
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <Footer></Footer>
  </div>
</template>

<script>
import InputSearch from "../components/adminComponents/InputSearch.vue"; // Import InputSearch component
import Footer from "../components/userComponents/Footer.vue";
import bookService from "../services/book.service"; // Import bookService

export default {
  components: {
    InputSearch,
    Footer, // Register InputSearch as a component
  },
  data() {
    return {
      loggedIn: Boolean(JSON.parse(localStorage.getItem("user"))?._id),
      books: [],
      searchText: "",
      isLoading: true,
      currentPage: 1,
      itemsPerPage: 10, // Số lượng sách trên mỗi trang
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage); // Tính tổng số trang
    },
    filteredBooks() {
      // Nếu không có từ khóa tìm kiếm, trả về tất cả sách
      if (!this.searchText.trim()) {
        return this.books;
      }
      // Lọc sách theo tên hoặc tác giả
      return this.books.filter(
        (book) =>
          book.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          book.author.toLowerCase().includes(this.searchText.toLowerCase())
      );
    },
    paginatedBooks() {
      // Lấy các sách của trang hiện tại
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.filteredBooks.slice(startIndex, endIndex);
    },
  },
  methods: {
    navigateToLogin() {
      this.$router.push("/login");
    },
    handleLogout() {
      localStorage.removeItem("user");
      this.loggedIn = false;
      this.$router.push("/");
    },
    async handleSearchBook() {
      try {
        if (this.searchText.trim()) {
          const result = await bookService.searchBooks(this.searchText);
          this.books = result.books || [];
        } else {
          this.books = []; // Xóa kết quả khi không có từ khóa tìm kiếm
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách:", error);
      }
    },
    async showAllHome() {
      try {
        this.books = await bookService.getAll();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return; // Kiểm tra trang hợp lệ
      this.currentPage = page;
    },
    navigateToBook(id) {
      this.$router.push("/" + id);
    },
  },
  mounted() {
    this.showAllHome();
  },
};
</script>

<style scoped>
/* Thêm CSS cho phân trang */
.pagination {
  display: flex;
  justify-content: center;
}

.page-item {
  cursor: pointer;
}

.page-item.disabled {
  pointer-events: none;
}

.page-item.active {
  font-weight: bold;
}
</style>

<style scoped>
.search-group {
  justify-content: center;
  width: 50%;
  margin-left: 100px;
}

.form-search {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-home {
  background-color: rgb(255, 255, 255);
  height: 140px;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}
.nav-home-navbar {
  background-color: rgb(255, 255, 255);
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#logo {
  margin-left: 30px;
  font-weight: 500;
  font-size: 20pt;
  color: blue;
}

.btn_nav {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* Điều chỉnh để các mục nằm ở bên phải */
  margin-right: 20px;
}

.btn_nav div > a {
  display: inline-block;
  text-decoration: none;
  margin: 0px 10px;
  padding: 10px;
  font-size: 15pt;
  font-weight: 500;
  cursor: pointer;
}

.btn_nav button {
  padding: 10px;
  font-size: 15pt;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background-color: transparent;
}

.btn_nav div:hover {
  background-color: rgb(222, 222, 222);
  border-radius: 5px;
  color: blue;
}

#product_h {
  margin: 30px 20px;
}

.book-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.book-item {
  padding: 8px;
  background-color: white;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.book-item:hover {
  border: 1px solid #007bff;
}

.book-item__img > img {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.book-item__info {
  display: flex;
  flex-direction: column;
  margin-left: 20px;
}

.book-item__title {
  font-size: 18px;
  margin: 8px 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-item__author {
  font-size: 14px;
  color: #888;
  margin: 4px 8px;
}

.book-item__btn {
  padding: 10px 12px;
  margin-top: 10px;
  border: 1px solid #007bff;
  border-radius: 20px;
}
</style>
