import { validateAddon } from "./validateAddon";

test("validateAddon returns a boolean, whether the alias is valid", () => {
  expect(validateAddon("World")).toBe(true);
  expect(validateAddon("Richard")).toBe(true);
  expect(validateAddon("Academy Scholars")).toBe(false);
  expect(
    validateAddon(
      "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url?page=1&tab=votes#tab-top"
    )
  ).toBe(false);
  expect(validateAddon("link-shortener--backend")).toBe(false);
  expect(validateAddon("link_shortener__backend")).toBe(true);
  expect(validateAddon("https://www.google.com/")).toBe(false);
});
