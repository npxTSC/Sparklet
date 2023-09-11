import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";

// Add the following Axios configuration to enable CORS (if needed)
axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "GET, POST, PUT, DELETE";

createApp(App).mount("#app");
