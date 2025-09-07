/**
 * Pagination Component
 * Navigation controls for paginated book results
 */

import React from 'react';
import {
  Box,
  Pagination as MuiPagination,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { PaginationState } from '@/types';

interface PaginationProps {
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  showResultsInfo?: boolean;
  pageSizeOptions?: number[];
  variant?: 'default' | 'compact';
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  showPageSizeSelector = true,
  showResultsInfo = true,
  pageSizeOptions = [10, 20, 40, 60],
  variant = 'default'
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentPage, totalPages, totalBooks, pageSize } = pagination;

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page);
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = event.target.value as number;
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  const startItem = totalBooks === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalBooks);

  if (variant === 'compact') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          py: 2,
        }}
      >
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
        />
      </Box>
    );
  }

  if (totalPages <= 1 && !showResultsInfo) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        py: 3,
        px: { xs: 1, md: 0 },
      }}
    >
      {/* Results Info */}
      {showResultsInfo && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            order: { xs: 2, md: 1 },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {totalBooks === 0
              ? 'No results found'
              : `Showing ${startItem.toLocaleString()}-${endItem.toLocaleString()} of ${totalBooks.toLocaleString()} books`}
          </Typography>

          {/* Page Size Selector */}
          {showPageSizeSelector && onPageSizeChange && totalBooks > Math.min(...pageSizeOptions) && (
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <InputLabel id="page-size-label">Per page</InputLabel>
              <Select
                labelId="page-size-label"
                value={pageSize}
                label="Per page"
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            order: { xs: 1, md: 2 },
          }}
        >
          <MuiPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? 'small' : 'medium'}
            showFirstButton={!isMobile}
            showLastButton={!isMobile}
            siblingCount={isMobile ? 0 : 1}
            boundaryCount={isMobile ? 1 : 2}
            sx={{
              '& .MuiPagination-ul': {
                flexWrap: 'nowrap',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default Pagination;
