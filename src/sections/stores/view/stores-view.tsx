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
import { useLazyGetStoresQuery, useDeleteStoreMutation } from "src/services/apis/storesApi";

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



const TABLE_HEAD = [
  { id: 'name', label: 'Website', sort: true },
  { id: 'platform', label: 'Platform', sort: true },
  { id: 'business', label: 'Business', sort: true },
  { id: 'creationDate', label: 'Creation Date', sort: true },
  { id: 'articlesCount', label: 'Articles', align: 'center', sort: true },
  { id: 'isConnected', label: 'Status', sort: true },
  { id: 'actions', label: 'Actions', align: 'center' },
];

export function StoresView() {
  const table = useTable();
  const navigate = useNavigate();
  const [stores, setStores] = useState<any[]>([]);

  const [filterName, setFilterName] = useState('');
  const [isAddStoreModalOpen, setIsAddStoreModalOpen] = useState(false);
  const [deletingStoreIds, setDeletingStoreIds] = useState<string[]>([]);

  const [doGetStores] = useLazyGetStoresQuery();
  // Add the delete store mutation hook
  const [deleteStore, { isLoading: isDeleting }] = useDeleteStoreMutation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      doGetStores()
        .unwrap()
        .then((result) => {
          setStores(result.stores);
          setIsLoading(false);
        })
        .catch(() => {
          setStores(_stores);
          setIsLoading(false);
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

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        // Add store ID to the deleting list to show loading state
        setDeletingStoreIds((prev) => [...prev, id]);
  
        // Call the real API instead of the fake one
        await deleteStore(Number(id)).unwrap();
        
        // Show success toast
        toast.success("Store deleted successfully");
  
        // Ensure table.selected exists before trying to remove selection
        if (table?.selected?.includes(id)) {
          table.onSelectRow?.(id);
        }
        
        // Update local state to remove the deleted store
        setStores((prev) => prev.filter((store) => store.id !== id));
        
      } catch (error) {
        console.error("Error deleting store:", error);
        toast.error("Failed to delete store. Please try again.");
      } finally {
        // Remove the store ID from deleting list
        setDeletingStoreIds((prev) => prev.filter((storeId) => storeId !== id));
      }
    },
    [table, deleteStore, setDeletingStoreIds]
  );
  

  const handleAddStoreSuccess = useCallback(() => {
    
    // Close the modal
    setIsAddStoreModalOpen(false);
  }, []);

  const handleAddNewStore = useCallback(() => {
    toast.success("tests")
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
              <Table sx={{ minWidth: 800 }}>
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
                        isDeleting={deletingStoreIds.includes(row.id)}
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