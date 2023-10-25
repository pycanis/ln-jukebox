export const getRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const roundToTen = (n: number) => Math.round(n / 10) * 10;
