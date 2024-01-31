export function paginator<T>(
  data: T[],
  totalCount: number,
  pageSize: number,
  currentPage: number = 1,
): {
  currentPage: number;
  pages: number;
  currentCount: number;
  totalCount: number;
  data: T[];
} {
  const maxPage = (count: number, pageSize: number): number => {
    return count === 0 ? 1 : Math.ceil(count / pageSize);
  };

  return {
    currentPage,
    pages: maxPage(totalCount, pageSize),
    currentCount: data.length,
    totalCount,
    data,
  };
}

declare module 'fastify' {
  export interface FastifyInstance {
    paginator: typeof paginator;
  }
}
