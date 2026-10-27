import type { App } from "vue";
import { createPinia } from "pinia";

export function registerAppProviders(app: App): void {
  app.use(createPinia());
}
