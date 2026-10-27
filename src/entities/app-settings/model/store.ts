import { defineStore } from "pinia";

export type AppLocale = "pt-BR" | "en";

export const useAppSettingsStore = defineStore("app-settings", {
  state: () => ({
    locale: "pt-BR" as AppLocale,
  }),
});
