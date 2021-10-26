import { validateURL } from "./validateURL";

test("validateURL returns a boolean, whether the url is valid", () => {
  expect(validateURL("World")).toBe(false);
  expect(validateURL("Richard")).toBe(false);
  expect(validateURL("Academy Scholars")).toBe(false);
  expect(
    validateURL(
      "https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url?page=1&tab=votes#tab-top"
    )
  ).toBe(true);
  expect(validateURL("https://github.com/moj124/link-shortener--backend")).toBe(
    true
  );
  expect(validateURL("https://www.google.com/")).toBe(true);
});
