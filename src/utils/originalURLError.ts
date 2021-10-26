export function originalURLError(condition: boolean): string {
  return !condition ? "Link is not a valid URL" : "URL is required";
}
