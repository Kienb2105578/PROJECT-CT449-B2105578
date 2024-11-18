<template>
  <div class="search-group text-center">
    <form @submit.prevent="handleSearchBook" class="form-search">
      <div class="input-group">
        <input
          type="text"
          name="search"
          id="search"
          autocomplete="off"
          placeholder="Tìm kiếm"
          class="form-control"
          v-model="searchQuery"
        />
      </div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        <span v-if="loading">Đang tìm kiếm...</span>
        <span v-else>Tìm kiếm</span>
      </button>
    </form>

    <!-- Hiển thị kết quả -->
    <ul class="list-group list-book__search" v-if="books.length > 0">
      <router-link
        v-for="item in books"
        :to="`/${item._id}`"
        class="list-group-item list-group-item-action"
        :key="item._id"
      >
        {{ item.name }}
      </router-link>
    </ul>

    <!-- Nếu không có kết quả tìm kiếm -->
    <div v-else-if="!loading && searchQuery.trim() !== ''" class="no-results">
      Không tìm thấy sách nào phù hợp.
    </div>

    <!-- Thông báo lỗi nếu có -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      books: [],
      searchQuery: "",
      loading: false,
      error: null,
    };
  },
  methods: {
    async handleSearchBook() {
      this.error = null; // Reset lỗi khi bắt đầu tìm kiếm
      this.books = []; // Xóa kết quả cũ khi bắt đầu tìm kiếm
      this.loading = true;

      try {
        if (this.searchQuery.trim()) {
          console.log("Đang tìm kiếm với từ khóa:", this.searchQuery); // Debug giá trị nhập vào

          // Gửi yêu cầu tìm kiếm
          const response = await axios.get("/search", {
            params: { q: this.searchQuery },
          });

          // Kiểm tra kết quả trả về
          if (
            response.data &&
            response.data.books &&
            response.data.books.length > 0
          ) {
            this.books = response.data.books;
          } else {
            console.log("Không tìm thấy sách nào");
            this.books = [];
          }
        }
      } catch (error) {
        console.error("Lỗi khi tìm kiếm sách:", error);
        this.error = "Lỗi khi tìm kiếm sách, vui lòng thử lại sau."; // Hiển thị lỗi
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Thanh tìm kiếm */
.search-group {
  justify-content: center;
  width: 50%;
  margin: 0 auto;
}

.list-book__search {
  width: 80%;
  margin: 10px auto;
}

.no-results {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* Form tìm kiếm */
.form-search {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-search .input-group {
  width: 400px;
}

.form-search button {
  margin-left: 10px;
}
</style>
