export function validateAddon(alias: string): boolean {
  const searchRegex = /^[a-zA-Z0-9_]*$/;
  return searchRegex.test(alias);
}
