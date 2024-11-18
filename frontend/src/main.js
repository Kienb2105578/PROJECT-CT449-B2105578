import "bootstrap/dist/css/bootstrap.css";
import "./assets/style.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./routes/index";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faFacebook,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

library.add(faFacebook, faInstagram, faYoutube);

const app = createApp(App);
app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
