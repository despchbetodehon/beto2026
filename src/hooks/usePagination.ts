import { useState, useMemo } from 'react';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Hook para gerenciar paginação
 * Reduz lógica duplicada em listas
 */
export function usePagination<T>(
  items: T[],
  pageSize: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, state } = useMemo(() => {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: items.slice(start, end),
      state: {
        currentPage,
        pageSize,
        total,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }, [items, currentPage, pageSize]);

  const goToPage = (page: number) => {
    const maxPage = Math.ceil(items.length / pageSize);
    setCurrentPage(Math.max(1, Math.min(page, maxPage)));
  };

  return {
    data,
    ...state,
    goToPage,
    nextPage: () => goToPage(currentPage + 1),
    prevPage: () => goToPage(currentPage - 1),
  };
}
