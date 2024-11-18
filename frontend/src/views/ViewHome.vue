<script>
import Home from "../components/userComponents/Home.vue";
import Nav from "../components/userComponents/NavUser.vue";
import Footer from "../components/userComponents/Footer.vue";
import bookService from "../services/book.service";
export default {
  components: {
    Home,
    Nav,
    Footer,
  },
  data() {
    return {
      books: [],
      isLoading: true,
    };
  },
  methods: {
    async showAllHome() {
      try {
        this.books = await bookService.getAll();
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoading = false;
      }
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

<template>
  <div class="container">
    <Nav></Nav>

    <div id="product_h">
      <div v-if="isLoading" class="loading">Đang tải...</div>
      <div class="book-list" v-else>
        <div
          class="book-item"
          v-for="item in books"
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

              <div class="book-item__price" id="book-price">
                {{ item.price }} VNĐ
              </div>
            </div>
          </div>
          <button class="btn btn-outline-primary book-item__btn">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>

    <Footer></Footer>
  </div>
</template>

<style scoped>
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
#book-price {
  margin-bottom: 20px;
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
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.book-item__btn {
  margin-top: auto;
  border-radius: 20px;
  border: 1px solid #007bff;
}
.book-item__author {
  font-size: 14px;
  color: #888;
}
.loading {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>
