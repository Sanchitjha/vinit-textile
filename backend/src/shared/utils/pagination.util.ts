export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationQuery {
  skip: number;
  limit: number;
}

export function toSkipLimit({ page, limit }: PaginationParams): PaginationQuery {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  return { skip: (safePage - 1) * safeLimit, limit: safeLimit };
}
