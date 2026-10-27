import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppSettingsStore } from "./store";

describe("app settings store", () => {
  beforeEach(() => setActivePinia(createPinia()));

  it("starts with Brazilian Portuguese as the interface locale", () => {
    expect(useAppSettingsStore().locale).toBe("pt-BR");
  });
});
