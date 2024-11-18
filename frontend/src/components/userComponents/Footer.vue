<template>
  <footer>
    <div class="container footer py-5">
      <!-- Phần giới thiệu ngắn -->
      <div class="row mb-4 text-center">
        <div class="col">
          <h3 class="text-uppercase">
            <router-link style="text-decoration: none" to="/">
              <img
                class="logo"
                style="height: 40px; margin-right: 10px"
                src="https://www.sapo.vn/Themes/Portal/Default/StylesV2/images/logo/Sapo-logo.svg?v=202101071107"
                alt="logo"
              />
              - Hành trình tri thức
            </router-link>
          </h3>
          <p class="motto mt-2">"Đồng hành cùng bạn qua từng trang sách"</p>
        </div>
      </div>
      <!-- Phần bản quyền -->
      <div class="text-center mt-4">
        <p class="mb-0">
          &copy; 2024 - Quản lý mượn sách. Mọi quyền được bảo lưu.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  color: black;
  background-color: #f8f9fa;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 20px 0px 0px 0px;
}

.footer .container {
  max-width: 1200px;
  margin: 0 auto;
}

.motto {
  font-size: 1rem;
  font-style: italic;
  color: #555;
  margin-top: 10px;
}

.text-center p {
  margin: 10px 0;
  font-size: 0.9rem;
}
</style>
