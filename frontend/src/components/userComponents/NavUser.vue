<template>
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
      <div class="search-group text-center">
        <form @submit.prevent="handleSearchBook" class="form-search">
          <div class="input-group">
            <input
              type="text"
              name="search"
              id="search"
              autocomplete="off"
              placeholder="Tìm kiếm sách"
              class="form-control"
              v-model="searchQuery"
            />
          </div>
          <button type="submit" class="btn btn-primary">Tìm kiếm</button>
        </form>

        <!-- Hiển thị danh sách sách dưới ô tìm kiếm -->
        <ul class="list-group list-book__search" v-if="books.length > 0">
          <router-link
            v-for="item in books"
            :to="`/book/${item._id}`"
            class="list-group-item list-group-item-action"
            :key="item._id"
          >
            {{ item.name }}
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import bookService from "../../services/book.service"; // Import bookService

export default {
  data() {
    return {
      loggedIn: Boolean(JSON.parse(localStorage.getItem("user"))?._id),
      books: [],
      searchQuery: "",
    };
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
        if (this.searchQuery.trim()) {
          const result = await bookService.searchBooks(this.searchQuery);
          // Lưu kết quả tìm kiếm vào localStorage (nếu cần)
          localStorage.setItem(
            "searchResults",
            JSON.stringify(result.books || [])
          );
          this.books = result.books || []; // Cập nhật danh sách sách tìm được
        } else {
          this.books = []; // Xóa kết quả khi không có từ khóa tìm kiếm
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách:", error);
      }
    },
  },
};
</script>

<style scoped>
.search-group {
  justify-content: center;
  width: 50%;
}

.list-book__search {
  width: 80%;
  margin-left: 68px;
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

.tieude {
  text-align: center;
  font-size: 25pt;
  font-weight: 700;
  color: brown;
  margin: 5px 0;
  padding-top: 10px;
  padding-bottom: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
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

.form-search .input-group {
  width: 400px; /* Điều chỉnh kích thước ô tìm kiếm */
}

.form-search button {
  margin-left: 10px; /* Thêm khoảng cách giữa ô tìm kiếm và nút tìm kiếm */
}
</style>
