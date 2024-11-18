<template>
  <div class="dashboard">
    <SidebarNav></SidebarNav>
    <div class="main">
      <h3 class="title-admin">Thêm mới</h3>
      <PublisherForm></PublisherForm>
    </div>
  </div>
</template>

<script>
import SidebarNav from "../../components/adminComponents/SidebarNav.vue";
import PublisherForm from "../../components/adminComponents/PublisherForm.vue";
export default {
  components: {
    SidebarNav,
    PublisherForm,
  },
};
</script>
