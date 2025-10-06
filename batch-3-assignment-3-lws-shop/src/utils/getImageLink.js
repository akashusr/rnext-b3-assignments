export const getImageLink = name => {
  return new URL(`../assets/img/${name}`, import.meta.url).href;
};