<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <h3 class="title-admin">Chỉnh sửa</h3>
      <p v-if="!loading">
        <PublisherForm :publisher="publisher"></PublisherForm>
      </p>
      <p v-if="loading">Không tìm thấy thông tin nhà xuất bản.</p>
    </div>
  </div>
</template>

<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import PublisherForm from "../../components/adminComponents/PublisherForm.vue";
import publisherService from "../../services/publisher.service";

export default {
  components: {
    SidebarNav,
    PublisherForm,
  },
  data() {
    return {
      publisher: {},
      loading: false,
    };
  },
  methods: {
    async getPublisherById(id) {
      try {
        this.loading = true;
        const response = await publisherService.getById(id);
        this.publisher = response;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getPublisherById(this.$route.params.id);
  },
};
</script>
