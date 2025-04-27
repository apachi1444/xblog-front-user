import type { Store } from "src/types/store";
import type { RootState } from "src/services/store";

import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from "src/layouts/dashboard";
import { setCurrentStore } from "src/services/slices/stores/storeSlice";
import { 
  useGetStoresQuery, 
  useDeleteStoreMutation,
  useReconnectStoreMutation,
  useDisconnectStoreMutation
} from "src/services/apis/storesApi";

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { LoadingSpinner } from "src/components/loading";

import { useTable } from "src/sections/user/view";

import AddStoreModal from '../../add-store/add-store-modal';
import { StoreTableRow } from "../components/store-table-row";
import { StoreTableHead } from "../components/store-table-head";
import { TableNoData } from '../../../components/table/table-no-data';
import { StoreTableToolbar } from "../components/store-table-toolbar";
import { emptyRows, applyFilter, getComparator } from '../components/utils';
import { TableEmptyRows } from '../../../components/table/table-empty-rows';
import { StoreSelectionDialog } from "../components/store-selection-dialog";

import type { StoreProps} from "../components/store-table-row";

const TABLE_HEAD = [
  { id: 'name', label: 'Website', sort: true, width: { xs: '25%', md: '20%' } },
  { id: 'platform', label: 'Platform', sort: true, width: { xs: '15%', md: '12%' } },
  { id: 'business', label: 'Business', sort: true, width: { xs: '15%', md: '12%' } },
  { id: 'creationDate', label: 'Creation Date', sort: true, width: { xs: '15%', md: '15%' } },
  { id: 'articlesCount', label: 'Articles', align: 'center', sort: true, width: { xs: '10%', md: '10%' } },
  { id: 'isConnected', label: 'Status', sort: true, align: 'center', width: { xs: '10%', md: '15%' } },
  { id: 'actions', label: 'Actions', width: { xs: '10%', md: '16%' } },
];

export function StoresView() {
  const table = useTable();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  // Use direct query hook instead of lazy loading
  const { 
    data, 
    isLoading, 
    isFetching 
  } = useGetStoresQuery(undefined, {
    // Add error handling at the query level
    refetchOnMountOrArgChange: true
  });

  const currentStore = useSelector((state: RootState) => state.stores.currentStore);
  const [filterName, setFilterName] = useState('');
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [showStoreSelection, setShowStoreSelection] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);

  // Use the mutations
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
  const [disconnectStore, { isLoading: isDisconnecting }] = useDisconnectStoreMutation();
  const [reconnectStore, { isLoading: isReconnecting }] = useReconnectStoreMutation();

  // Get stores directly from the query result
  const stores = useMemo(() => data?.stores || [], [data]);

  const dataFiltered = useMemo(() => 
    applyFilter({
      inputData: stores as StoreProps[],
      comparator: getComparator(table.order, table.orderBy),
      filterName,
    }),
    [stores, table.order, table.orderBy, filterName]
  );

  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    table.onResetPage();
  }, [table]);

  const performDelete = useCallback(async (id: string) => {
    try {
      await deleteStore(Number(id)).unwrap();
      toast.success(t('store.deleteSuccess'));
      
      if (table?.selected?.includes(id)) {
        table.onSelectRow?.(id);
      }
    } catch (error) {
      toast.error(t('store.deleteError'));
    }
    
  }, [deleteStore, t, table]);

  const handleDelete = useCallback(
    async (id: string) => {
      // If deleting current store and there are other stores available
      if (id === currentStore?.id && stores.length > 1) {
        setStoreToDelete(id);
        setShowStoreSelection(true);
        return;
      }

      await performDelete(id);
    },
    [currentStore?.id, performDelete, stores.length]
  );

  const handleStoreSelection = async (selectedStore: Store) => {
    if (storeToDelete) {
      dispatch(setCurrentStore(selectedStore));
      await performDelete(storeToDelete);
      setStoreToDelete(null);
    }
  };

  const handleDisconnect = useCallback(
    async (id: string) => {
      try {
        await disconnectStore(Number(id)).unwrap();
        toast.success("Website disconnected successfully");
      } catch (error) {
        toast.error("Failed to disconnect website. Please try again.");
      }
    },
    [disconnectStore]
  );

  const handleReconnect = useCallback(
    async (id: string) => {
      try {
        await reconnectStore(Number(id)).unwrap();
        toast.success("Website reconnected successfully");
      } catch (error) {
        toast.error("Failed to reconnect website. Please try again.");
      }
    },
    [reconnectStore, ]
  );

  const handleAddStoreSuccess = useCallback(() => {
    setIsAddStoreModalOpen(false);
  }, []);

  const handleAddNewStore = useCallback(() => {
    navigate("/stores/add");
  }, [navigate]);

  // UI state derived from data
  const notFound = !dataFiltered.length && !!filterName;
  const isDataEmpty = stores.length === 0;

  // Paginated data for the current page
  const paginatedData = useMemo(() => 
    dataFiltered.slice(
      table.page * table.rowsPerPage,
      table.page * table.rowsPerPage + table.rowsPerPage
    ),
    [dataFiltered, table.page, table.rowsPerPage]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Websites
        </Typography>
        <Button
          variant="contained"
          onClick={handleAddNewStore}
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{
            bgcolor: 'primary.main',
            color: 'text.light',
          }}
        >
          New website
        </Button>
      </Box>

      {isLoading ? (
        <LoadingSpinner 
          message="Loading your websites..." 
          fullHeight 
        />
      ) : (
        <Card>
          <StoreTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={handleFilterChange}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ 
                minWidth: { xs: 650, sm: 800 },
                tableLayout: 'fixed'
              }}>
                <StoreTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  rowCount={stores.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked: boolean) =>
                    table.onSelectAllRows(
                      checked,
                      stores.map((store: { id: any; }) => store.id)
                    )
                  }
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {paginatedData.map((row) => (
                    <StoreTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDelete={handleDelete}
                      onDisconnect={handleDisconnect}
                      onReconnect={handleReconnect}
                      isDeleting={isDeleting}
                      isDisconnecting={isDisconnecting}
                      isReconnecting={isReconnecting}
                    />
                  ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, stores.length)}
                  />

                  {!isLoading && (notFound || isDataEmpty) && !isFetching && (
                    <TableNoData searchQuery={filterName} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      )}
      
      <AddStoreModal
        open={isAddStoreModalOpen}
        onClose={() => setIsAddStoreModalOpen(false)}
        onSuccess={handleAddStoreSuccess}
      />
      <StoreSelectionDialog
        open={showStoreSelection}
        stores={stores.filter(store => store.id !== storeToDelete)}
        onClose={() => {
          setShowStoreSelection(false);
          setStoreToDelete(null);
        }}
        onSelect={handleStoreSelection}
      />
    </DashboardContent>
  );
}