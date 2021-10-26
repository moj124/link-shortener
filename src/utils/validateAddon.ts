export function validateAddon(alias: string): boolean {
  const searchRegex = /^[a-zA-Z0-9_]*$/;

  console.log(searchRegex.test(alias));
  return searchRegex.test(alias);
}
