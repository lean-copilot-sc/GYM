"use client";

import { DataGrid, GridColDef, GridPaginationModel, GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { Box, LinearProgress, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';

export type AppTableProps<T> = {
  columns: GridColDef[];
  rows: T[];
  rowHeight?: number;
  loading?: boolean;
  pageSizeOptions?: number[];
};

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
}

export function AppTable<T extends { id: string | number }>({
  columns,
  rows,
  rowHeight = 56,
  loading = false,
  pageSizeOptions = [5, 10, 25]
}: AppTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: pageSizeOptions[0] });

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <DataGrid
        disableColumnMenu={isMobile}
        slots={{ toolbar: CustomToolbar, loadingOverlay: LinearProgress }}
        columns={columns}
        rows={rows}
        rowHeight={rowHeight}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={pageSizeOptions}
      />
    </Box>
  );
}
