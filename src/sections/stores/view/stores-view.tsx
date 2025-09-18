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
import { setCurrentStore, clearCurrentStore } from "src/services/slices/stores/storeSlice";
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
  { id: 'name', label: 'Website', sort: true, width: { xs: '20%', md: '18%' } },
  { id: 'platform', label: 'Platform', sort: true, width: { xs: '12%', md: '10%' } },
  { id: 'business', label: 'Business', sort: true, width: { xs: '12%', md: '10%' } },
  { id: 'creationDate', label: 'Creation Date', sort: true, width: { xs: '12%', md: '12%' } },
  { id: 'articlesCount', label: 'Articles', align: 'center', sort: true, width: { xs: '8%', md: '8%' } },
  { id: 'isConnected', label: 'Connection', sort: true, align: 'center', width: { xs: '10%', md: '12%' } },
  { id: 'actions', label: 'Actions', width: { xs: '26%', md: '30%' } },
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
  } = useGetStoresQuery();

  const currentStore = useSelector((state: RootState) => state.stores.currentStore);
  const [filterName, setFilterName] = useState('');
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [showStoreSelection, setShowStoreSelection] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<number | null>(null);

  // Use the mutations
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
  const [disconnectStore, { isLoading: isDisconnecting }] = useDisconnectStoreMutation();
  const [reconnectStore, { isLoading: isReconnecting }] = useReconnectStoreMutation();

  // Get stores directly from the query result
  const stores = useMemo(() => data?.stores || [], [data]);

  // Separate stores by type
  const socialMediaPlatforms = useMemo(() =>
    ['linkedin', 'reddit', 'quora', 'x', 'instagram', 'facebook', 'twitter'],
    []
  );

  const websiteStores = useMemo(() =>
    stores.filter(store => !socialMediaPlatforms.includes(store.category?.toLowerCase())),
    [socialMediaPlatforms, stores]
  );

  const socialMediaStores = useMemo(() =>
    stores.filter(store => socialMediaPlatforms.includes(store.category?.toLowerCase())),
    [socialMediaPlatforms, stores]
  );

  const websiteDataFiltered = useMemo(() =>
    applyFilter({
      inputData: websiteStores as StoreProps[],
      comparator: getComparator(table.order, table.orderBy),
      filterName,
    }),
    [websiteStores, table.order, table.orderBy, filterName]
  );

  const socialMediaDataFiltered = useMemo(() =>
    applyFilter({
      inputData: socialMediaStores as StoreProps[],
      comparator: getComparator(table.order, table.orderBy),
      filterName,
    }),
    [socialMediaStores, table.order, table.orderBy, filterName]
  );

  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    table.onResetPage();
  }, [table]);

  const performDelete = useCallback(async (id: number) => {
    try {
      await deleteStore(id).unwrap();

      // If we deleted the current store, clear it from Redux and localStorage
      if (id === currentStore?.id) {
        dispatch(clearCurrentStore());
      }

      toast.success(t('store.deleteSuccess', 'Store deleted successfully'));
    } catch (error) {
      toast.error(t('store.deleteError', 'Failed to delete store'));
    }
  }, [deleteStore, t, currentStore?.id, dispatch]);

  const handleDelete = useCallback(
    async (id: number) => {
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
  const notFound = !websiteDataFiltered.length && !!filterName;
  const isDataEmpty = stores.length === 0;

  // Paginated data for the current page
  const websitePaginatedData = useMemo(() =>
    websiteDataFiltered.slice(
      table.page * table.rowsPerPage,
      table.page * table.rowsPerPage + table.rowsPerPage
    ),
    [websiteDataFiltered, table.page, table.rowsPerPage]
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Websites
        </Typography>
        <Button
          variant="outlined"
          onClick={handleAddNewStore}
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            bgcolor: 'transparent',
            '&:hover': {
              bgcolor: 'rgba(79, 70, 229, 0.08)',
              borderColor: 'primary.dark',
            }
          }}
        >
          Add New Website
        </Button>
      </Box>

      {isLoading ? (
        <LoadingSpinner
          message="Loading your websites..."
          fullHeight
        />
      ) : (
        <>
          {/* Empty State - No Websites */}
          {websiteStores.length === 0 && socialMediaStores.length === 0 && (
            <Box textAlign="center" py={5}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {t('websites.empty.title', 'No websites connected')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('websites.empty.description', 'Connect your first website to start publishing content')}
              </Typography>
              <Button
                variant="contained"
                onClick={handleAddNewStore}
                startIcon={<Iconify icon="solar:add-circle-bold" />}
              >
                {t('websites.empty.addFirst', 'Add Your First Website')}
              </Button>
            </Box>
          )}

          {/* Websites Section */}
          {websiteStores.length > 0 && (
            <Card sx={{ mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🌐 Connected Websites
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your connected websites and their publishing settings
                </Typography>
              </Box>

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
                      rowCount={websiteStores.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked: boolean) =>
                        table.onSelectAllRows(
                          checked,
                          websiteStores.map((store: { id: any; }) => store.id)
                        )
                      }
                      headLabel={TABLE_HEAD}
                    />
                    <TableBody>
                      {websitePaginatedData.map((row) => (
                        <StoreTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id.toString())}
                          onSelectRow={() => table.onSelectRow(row.id.toString())}
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
                        emptyRows={emptyRows(table.page, table.rowsPerPage, websiteStores.length)}
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
                count={websiteDataFiltered.length}
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            </Card>
          )}

          {/* Social Media Section */}
          {socialMediaStores.length > 0 && (
            <Card sx={{ mb: 4 }}>
              <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  📱 Social Media Platforms
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your connected social media accounts for content sharing
                </Typography>
              </Box>

              <Scrollbar>
                <TableContainer sx={{ overflow: 'unset' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <StoreTableHead
                      order={table.order}
                      orderBy={table.orderBy}
                      rowCount={socialMediaStores.length}
                      numSelected={table.selected.length}
                      onSort={table.onSort}
                      onSelectAllRows={(checked: boolean) =>
                        table.onSelectAllRows(
                          checked,
                          socialMediaStores.map((store: { id: any; }) => store.id)
                        )
                      }
                      headLabel={TABLE_HEAD}
                    />

                    <TableBody>
                      {socialMediaDataFiltered.map((row) => (
                        <StoreTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id.toString())}
                          onSelectRow={() => table.onSelectRow(row.id.toString())}
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
                        emptyRows={emptyRows(table.page, table.rowsPerPage, socialMediaStores.length)}
                      />

                      {!isLoading && socialMediaStores.length === 0 && !isFetching && (
                        <TableNoData title="No social media platforms connected" searchQuery="" />
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          )}

        </>
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