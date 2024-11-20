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
          <h3 class="title-admin">Thông tin nhà xuất bản</h3>
        </div>

        <div class="row mb-4">
          <div class="col-md-6">
            <button
              class="btn btn-outline-primary m-2 add-button"
              @click="navigateToCreatePublisher"
            >
              Thêm mới
            </button>
          </div>
          <div class="col-md-6">
            <InputSearch
              v-model="searchText"
              placeholder="Tìm kiếm nhà xuất bản..."
            />
          </div>
        </div>

        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" style="width: 10%">STT</th>
              <th scope="col" style="width: 55%">Nhà xuất bản</th>
              <th scope="col" style="width: 20%">Địa chỉ</th>
              <th scope="col" style="width: 15%"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedPublishers" :key="item._id">
              <th scope="row">
                {{ index + 1 + (currentPage - 1) * pageSize }}
              </th>
              <td>{{ item.name }}</td>
              <td>{{ item.address }}</td>
              <td>
                <div style="display: flex; gap: 10px">
                  <button
                    class="btn btn-primary"
                    @click="navigateToUpdatePublisher(item._id)"
                  >
                    Sửa
                  </button>
                  <button
                    class="btn btn-danger"
                    @click="deletePublisher(item._id)"
                  >
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
                  >&laquo;</a
                >
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
                  >&raquo;</a
                >
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
import InputSearch from "../../components/adminComponents/InputSearch.vue";
import publisherService from "../../services/publisher.service";

export default {
  components: {
    SidebarNav,
    InputSearch,
  },
  data() {
    return {
      publishers: [], // Lưu trữ tất cả nhà xuất bản
      searchText: "", // Tìm kiếm theo tên và địa chỉ
      currentPage: 1, // Trang hiện tại
      pageSize: 5, // Số lượng nhà xuất bản mỗi trang
    };
  },
  computed: {
    filteredPublishers() {
      if (!this.searchText) return this.publishers; // Nếu không tìm kiếm, trả về tất cả
      const search = this.searchText.toLowerCase();
      return this.publishers.filter(
        (item) =>
          item.name.toLowerCase().includes(search) ||
          item.address.toLowerCase().includes(search)
      );
    },
    paginatedPublishers() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredPublishers.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredPublishers.length / this.pageSize); // Tổng số trang
    },
  },
  methods: {
    async getAll() {
      try {
        this.publishers = await publisherService.getAll();
      } catch (error) {
        console.log(error);
      }
    },
    async deletePublisher(id) {
      try {
        await publisherService.delete(id);
        this.publishers = this.publishers.filter((item) => item._id !== id);
      } catch (error) {
        console.log(error);
      }
    },
    navigateToCreatePublisher() {
      this.$router.push("/admin/publisher/create");
    },
    navigateToUpdatePublisher(id) {
      this.$router.push("/admin/publisher/" + id);
    },
    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
  },
  mounted() {
    this.getAll();
  },
};
</script>
