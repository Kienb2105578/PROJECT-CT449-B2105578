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
          <h3 class="title-admin">Thông tin mượn sách</h3>
        </div>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên sách</th>
              <th scope="col">Người mượn</th>
              <th scope="col">Ngày mượn</th>
              <th scope="col">Ngày hẹn trả</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in borrowBooks" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.book.name }}</td>
              <td>{{ item.reader.username }}</td>
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
                  <!-- <button class="btn btn-danger">Xóa</button> -->
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
import borrowBookService from "../../services/borrowBook.service";
export default {
  components: {
    SidebarNav,
  },
  data() {
    return {
      borrowBooks: [],
    };
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
  },
  mounted() {
    this.getAll();
  },
};
</script>
