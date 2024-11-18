<!-- src/components/Popup.vue -->
<template>
  <div v-if="showPopup" class="popup-overlay">
    <div class="popup-content">
      <h3>Thông báo</h3>
      <p>{{ popupMessage }}</p>
      <button
        class="btn btn-outline-primary"
        style="border-radius: 20px; width: 50%"
        @click="closePopup"
      >
        Đóng
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showPopup: Boolean,
    popupMessage: String,
  },
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 20px; /* Khoảng cách từ trên cùng của màn hình */
  left: 50%; /* Căn popup từ giữa màn hình */
  transform: translateX(
    -50%
  ); /* Dịch chuyển popup sang trái để hoàn toàn căn giữa */
  width: auto;
  height: auto;
  display: flex;
  align-items: flex-start; /* Đảm bảo căn phần tử popup từ trên xuống */
  justify-content: center; /* Căn popup về phía trung tâm */
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.popup-content h3 {
  margin: 0;
  margin-bottom: 10px;
}

.popup-content button {
  margin-top: 10px;
}
</style>
