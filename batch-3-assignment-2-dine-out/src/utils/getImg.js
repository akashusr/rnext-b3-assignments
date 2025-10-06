export const getImg = (string) =>
  new URL(`../assets/images/${string}.svg`, import.meta.url);
