import { createApp } from "vue";
import App from "./App.vue";
import { registerAppProviders } from "./providers";

const app = createApp(App);

registerAppProviders(app);
app.mount("#app");
