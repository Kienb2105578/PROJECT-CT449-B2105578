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

        <div>
          <button
            class="btn btn-outline-primary m-2 add-button"
            @click="navigateToCreatePublisher"
          >
            Thêm mới
          </button>
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
            <tr v-for="(item, index) in publishers" :key="item._id">
              <th scope="row">{{ index + 1 }}</th>
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
      </div>
    </div>
  </div>
</template>

<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import publisherService from "../../services/publisher.service";
export default {
  components: {
    SidebarNav,
  },
  data() {
    return {
      publishers: [],
    };
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
  },
  mounted() {
    this.getAll();
  },
};
</script>
