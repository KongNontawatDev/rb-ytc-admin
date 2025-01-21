export const calculatePagination = (page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  return { start, end };
};
