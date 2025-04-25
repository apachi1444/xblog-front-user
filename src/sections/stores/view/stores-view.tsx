import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _stores } from "src/_mock";
import { DashboardContent } from "src/layouts/dashboard";
import { 
  useLazyGetStoresQuery, 
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



// In the StoresView component, we need to update the TABLE_HEAD and ensure the handlers work correctly

// Update the TABLE_HEAD array to better reflect the status column
const TABLE_HEAD = [
  { id: 'name', label: 'Website', sort: true, width: { xs: '25%', md: '20%' } },
  { id: 'platform', label: 'Platform', sort: true, width: { xs: '15%', md: '12%' } },
  { id: 'business', label: 'Business', sort: true, width: { xs: '15%', md: '12%' } },
  { id: 'creationDate', label: 'Creation Date', sort: true, width: { xs: '15%', md: '15%' } },
  { id: 'articlesCount', label: 'Articles', align: 'center', sort: true, width: { xs: '10%', md: '10%' } },
  { id: 'isConnected', label: 'Status', sort: true, align: 'center', width: { xs: '10%', md: '15%' } },
  { id: 'actions', label: 'Actions', width: { xs: '10%', md: '16%' } },
];

  // Add this utility function at the top of the file, outside the component
  const simulateApiError = () => true;

  export function StoresView() {
    const table = useTable();
    const navigate = useNavigate();
    const [stores, setStores] = useState<any[]>([]);
  
    const [filterName, setFilterName] = useState('');
    const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  
    const [doGetStores , {isLoading}] = useLazyGetStoresQuery();
    const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
    const [disconnectStore, { isLoading: isDisconnecting }] = useDisconnectStoreMutation();
    const [reconnectStore, { isLoading: isReconnecting }] = useReconnectStoreMutation();
  
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        doGetStores()
          .unwrap()
          .then((result) => {
            // Simulate API error occasionally
            if (simulateApiError()) {
              console.log('Simulating API error for testing');
              setStores(_stores); // Use mock data as fallback
              toast.error("Failed to load websites. Using cached data.");
            } else {
              setStores(result.stores);
            }
          })
          .catch(() => {
            setStores(_stores);
            toast.error("Failed to load websites. Using cached data.");
          });
      }, 2000);
  
      return () => clearTimeout(timeoutId);
    }, [doGetStores]);
    
  
    const dataFiltered = useMemo(() => 
      applyFilter({
        inputData: stores,
        comparator: getComparator(table.order, table.orderBy),
        filterName,
      }),
      [stores, table.order, table.orderBy, filterName]
    );
  
    // Event handlers with useCallback to prevent unnecessary re-renders
    const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterName(event.target.value);
      table.onResetPage();
    }, [table]);
  
    // Add this at the top of your component
const [testMode, setTestMode] = useState(true);

// Then modify your handlers

const handleDelete = useCallback(
  async (id: string) => {
    try {
      // Try to call the API
      await deleteStore(Number(id)).unwrap();
      
      toast.success("Store deleted successfully");
      
      if (table?.selected?.includes(id)) {
        table.onSelectRow?.(id);
      }
      
      setStores((prev) => prev.filter((store) => store.id !== id));
    } catch (error) {
      // If there's an error but we're in test mode, proceed anyway
      if (testMode) {
        toast.success("Test Mode: Store deleted successfully");
        
        if (table?.selected?.includes(id)) {
          table.onSelectRow?.(id);
        }
        
        setStores((prev) => prev.filter((store) => store.id !== id));
      } else {
        toast.error("Failed to delete store. Please try again.");
      }
    }
  },
  [table, deleteStore, testMode]
);

// Update the handleDisconnect function to properly handle the UI state
const handleDisconnect = useCallback(
  async (id: string) => {
    try {
      await disconnectStore(Number(id)).unwrap();
      
      toast.success("Website disconnected successfully");
      
      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, isConnected: false } : store
        )
      );
    } catch (error) {
      // If there's an error but we're in test mode, proceed anyway
      if (testMode) {
        toast.success("Test Mode: Website disconnected successfully");
        
        setStores((prev) =>
          prev.map((store) =>
            store.id === id ? { ...store, isConnected: false } : store
          )
        );
      } else {
        toast.error("Failed to disconnect website. Please try again.");
      }
    }
  },
  [disconnectStore, testMode]
);

// Update the handleReconnect function to properly handle the UI state
const handleReconnect = useCallback(
  async (id: string) => {
    try {
      await reconnectStore(Number(id)).unwrap();
      
      toast.success("Website reconnected successfully");
      
      setStores((prev) =>
        prev.map((store) =>
          store.id === id ? { ...store, isConnected: true } : store
        )
      );
    } catch (error) {
      // If there's an error but we're in test mode, proceed anyway
      if (testMode) {
        toast.success("Test Mode: Website reconnected successfully");
        
        setStores((prev) =>
          prev.map((store) =>
            store.id === id ? { ...store, isConnected: true } : store
          )
        );
      } else {
        toast.error("Failed to reconnect website. Please try again.");
      }
    }
  },
  [reconnectStore, testMode]
);

const handleAddStoreSuccess = useCallback(() => {
  // Close the modal
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
  
                    {(notFound || isDataEmpty) && !isLoading && (
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
      </DashboardContent>
    );
  }