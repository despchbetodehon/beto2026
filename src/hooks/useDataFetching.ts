// Reusable Hook for Data Fetching
import { useState, useEffect, useCallback } from 'react';
import { ApiResponse, PaginatedResponse } from '@/types/entities';

export interface UseFetchOptions {
  skip?: boolean;
  refetchInterval?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export const useFetchData = <T,>(
  endpoint: string,
  options?: UseFetchOptions
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options?.skip) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result: ApiResponse<T> = await response.json();
      if (result.success && result.data) {
        setData(result.data);
        options?.onSuccess?.(result.data);
      } else {
        throw new Error(result.error || 'Erro ao buscar dados');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      options?.onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();

    if (options?.refetchInterval) {
      const interval = setInterval(fetchData, options.refetchInterval);
      return () => clearInterval(interval);
    }
  }, [endpoint, options?.refetchInterval]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch };
};

// Hook para paginação
export const usePagination = <T,>(
  items: T[],
  itemsPerPage: number = 10
) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = (pageNumber: number) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(validPage);
  };

  const nextPage = () => goToPage(page + 1);
  const prevPage = () => goToPage(page - 1);
  const reset = () => setPage(1);

  return {
    page,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    reset,
    isFirstPage: page === 1,
    isLastPage: page === totalPages,
  };
};

// Hook para filtros
export interface UseFiltersOptions<T> {
  items: T[];
  filterFn?: (item: T, filters: Record<string, any>) => boolean;
}

export const useFilters = <T,>({ items, filterFn }: UseFiltersOptions<T>) => {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filtered = filterFn
    ? items.filter((item) => filterFn(item, filters))
    : items;

  const addFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const removeFilter = (key: string) => {
    setFilters((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const updateFilter = (key: string, value: any) => {
    addFilter(key, value);
  };

  return {
    filters,
    filtered,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
  };
};

// Hook para loading e error states
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
    'idle'
  );
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error as E);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};

// Hook para formulário
export interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  onError?: (error: Error) => void;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  onError,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setValues((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
    setError(null);
  };

  const setFieldValue = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return {
    values,
    loading,
    error,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
  };
};
