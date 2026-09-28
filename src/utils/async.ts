export const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

export const randomBetween = (min: number, max: number) =>
  Math.round(min + Math.random() * (max - min));
