export const checkNumber = (val: unknown, fallback: number) =>
  !Number.isNaN(Number(val)) ? Number(val) : fallback;

type CursorPage<T> = {
  data: T[];
  nextCursor?: number;
  hasMore: boolean;
  pageSize: number;
};

export async function paginate<T extends { id: number }>(
  finder: (cursor?: number, limit?: number) => Promise<T[]>,
  pageSize = 10,
  cursor?: number,
): Promise<CursorPage<T>> {
  const results = await finder(cursor, pageSize + 1);
  const hasMore = results.length > pageSize;
  const data = results.slice(0, pageSize);

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1].id : undefined,
    hasMore,
    pageSize,
  };
}
