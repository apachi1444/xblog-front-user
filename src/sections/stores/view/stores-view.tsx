import type { Store } from "src/types/store";

import { useSnackbar } from "notistack";
import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import { Alert, Snackbar } from "@mui/material";
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fakeStores } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify'
import { Scrollbar } from 'src/components/scrollbar';

import AddStoreModal from '../../add-store/add-store-modal';
import { StoreTableRow } from "../components/store-table-row";
import { StoreTableHead } from "../components/store-table-head";
import { TableNoData } from '../../../components/table/table-no-data';
import { StoreTableToolbar } from "../components/store-table-toolbar";
import { emptyRows, applyFilter, getComparator } from '../components/utils';
import { TableEmptyRows } from '../../../components/table/table-empty-rows';

import type { StoreProps } from "../components/store-table-row";


// ----------------------------------------------------------------------

export function StoresView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: StoreProps[] = applyFilter({
    inputData: fakeStores,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort)
  }, [])

  const handleDelete = useCallback((id: string) => {
    // Handle store deletion logic
    console.log('Deleting store with ID:', id);
    enqueueSnackbar('Store deleted successfully!', { 
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' }
    });
  }, [enqueueSnackbar])

  const handleAddStoreSuccess = useCallback(() => {
    enqueueSnackbar('Store connected successfully!', { 
      variant: 'success',
      anchorOrigin: { vertical: 'top', horizontal: 'center' }
    });
  }, [enqueueSnackbar]);

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Websites
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => {
            navigate("/stores/add")
          }}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New website
        </Button>
      </Box>

      <Card>
        <StoreTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <StoreTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={fakeStores.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    fakeStores.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Website', sort: true },
                  { id: 'platform', label: 'Platform', sort: true },
                  { id: 'business', label: 'Business', sort: true },
                  { id: 'creationDate', label: 'Creation Date', sort: true },
                  { id: 'articlesCount', label: 'Articles', align: 'center', sort: true },
                  { id: 'isConnected', label: 'Status', sort: true },
                  { id: '', label: 'Actions' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <StoreTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={handleDelete}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, fakeStores.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={fakeStores.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
      <AddStoreModal
        open={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onSuccess={handleAddStoreSuccess}
      />

      <Snackbar 
          open={isAddStoreModalOpen} 
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={3000}
        >
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Store connected successfully!
          </Alert>
      </Snackbar>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
