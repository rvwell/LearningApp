import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import App from "./App.vue";

describe("App shell", () => {
  it("shows the LearningApp identity and primary navigation region", () => {
    const wrapper = mount(App);

    expect(wrapper.get("h1").text()).toBe("LearningApp");
    expect(wrapper.find('nav[aria-label="Navegação principal"]').exists()).toBe(true);
  });
});
