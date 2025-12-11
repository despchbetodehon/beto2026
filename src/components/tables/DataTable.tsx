import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { usePagination } from '@/hooks';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string | number;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey: keyof T;
  onRowClick?: (row: T) => void;
  pageSize?: number;
}

/**
 * Tabela genérica reutilizável com paginação
 * Reduz duplicação de código em múltiplas páginas
 */
export const DataTable = memo(<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  onRowClick,
  pageSize = 10
}: DataTableProps<T>) => {
  const { data: paginatedData, currentPage, totalPages, goToPage, nextPage, prevPage } = usePagination(data, pageSize);

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                  width={col.width}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow
                key={String(row[rowKey])}
                onClick={() => onRowClick?.(row)}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': onRowClick ? { backgroundColor: 'action.hover' } : {}
                }}
              >
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

DataTable.displayName = 'DataTable';
