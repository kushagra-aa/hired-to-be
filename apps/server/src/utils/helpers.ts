export const checkNumber = (val: unknown, fallback: number) =>
  !Number.isNaN(Number(val)) ? Number(val) : fallback;
