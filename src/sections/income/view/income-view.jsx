import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  fetchItems,
  fetchIncomes,
  addIncome,
  editIncome,
  deleteIncome,
} from 'src/services/apiService';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import IncomeTableRow from '../income-table-row';
import IncomeTableHead from '../income-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows } from '../utils';

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIncomeId, setCurrentIncomeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMesage, setSuccessMesage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteIncomeId, setDeleteIncomeId] = useState(null);
  const [loadingIncomes, setLoadingIncomes] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [incomeAmount, setAmount] = useState('');
  const [incomeDate, setDate] = useState('');
  const [incomeNote, setNote] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});

const headLabel = [
  { id: 'date', label: 'Date', filterType: 'date' },
  { id: 'amount', label: 'Amount', filterType: 'number' },
  { id: 'note', label: 'Note', filterType: 'text' },
  { id: 'item_id', label: 'Item', filterType: 'autocomplete' },
  { id: '',label: '', filterType: null  },
];

const filterTypes = {
  amount: { filterType: 'text', type: 'contains' },
  date: { filterType: 'text', type: 'equals' },
  note: { filterType: 'text', type: 'contains' },
  item_id: { filterType: 'text', type: 'equals' }
};
  const fetchIncomesFromAPI = useCallback(async (filterModel, currentPage, currentRowsPerPage, sortOrder, sortBy) => {
    setLoadingIncomes(true);
    try {
      const startRow = currentPage * currentRowsPerPage;
      const endRow = startRow + currentRowsPerPage;
      const sortModel = sortBy ? [{ field: sortBy, sort: sortOrder }] : [];

      const payload = {
        startRow,
        endRow,
        filterModel,
        sortModel,
      };

      // console.log(payload);
      const data = await fetchIncomes(payload);
      setIncomes(data.rowData);
      setRowCount(data.rowCount);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    } finally {
      setLoadingIncomes(false);
    }
  }, []); // Ensure stable reference with an empty dependency array

  const fetchItemsFromAPI = useCallback(async () => {
    const data = await fetchItems(1);
    setItems(data);
  }, []); // Ensure stable reference with an empty dependency array

  const handleFilterChange = (id, value, filterType, type) => {
    setFilters((prevFilters) => {
      const restFilters = { ...prevFilters };
      delete restFilters[id]; // Remove the filter if it exists
  
      if (value === '' || value === null) {
        return restFilters; // Return without the removed filter
      }
  
      return {
        ...prevFilters,
        [id]: { filter: value, filterType, type },
      };
    });
  };

  useEffect(() => {
    fetchItemsFromAPI();
  }, [fetchItemsFromAPI]);

  useEffect(() => {
    fetchIncomesFromAPI(filters, page, rowsPerPage, order, orderBy);
  }, [filters, page, rowsPerPage, order, orderBy, fetchIncomesFromAPI]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  const notFound = !incomes.length && !loadingIncomes;

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setNote('');
    setDate('');
    setAmount('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentIncomeId(null);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  // Change the date handling to use a plain HTML input
  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleItemChange = (newItem) => {
    setSelectedItem(newItem);
  };

  const handleSuccessClose = () => {
    setSuccessMesage(null);
  };

  const handleErrorClose = () => {
    setApiError(null);
  };

  const handleAddIncome = async () => {
    setLoading(true);

    try {
      const incomeData = {
        amount: incomeAmount, // Updated key
        date: incomeDate,     // Updated key
        item_id: selectedItem?.id,
        note: incomeNote,     // Updated key
      };

      if (isEditMode) {
        await editIncome(currentIncomeId, incomeData);
        setSuccessMesage('Income updated successfully');
      } else {
        await addIncome(incomeData);
        setSuccessMesage('Income added successfully');
      }

      fetchIncomesFromAPI(filters, page, rowsPerPage, order, orderBy); // Pass current filters and pagination settings
      handleClose();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditIncome = (id, date, amount, note, itemId) => {
    setCurrentIncomeId(id);
    setNote(note);
    setDate(date);
    setAmount(amount);

    // Convert itemId to number for comparison
    const itemIdNum = Number(itemId);
    const itemToSelect = items.find((item) => item.id === itemIdNum);

    setSelectedItem(itemToSelect || null); // Set the selected item or null if not found

    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteIncome = async (id) => {
    setConfirmDelete(true);
    setDeleteIncomeId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteIncomeId) {
      setLoadingDelete(true);
      try {
        await deleteIncome(deleteIncomeId);
        setSuccessMesage('Income deleted successfully');
        fetchIncomesFromAPI(filters, page, rowsPerPage, order, orderBy);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoadingDelete(false);
        setConfirmDelete(false);
        setDeleteIncomeId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteIncomeId(null);
  };

  return (
    <>
      <Helmet>
        <title>Income List</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Income List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleClickOpen}
          >
            New Income
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 300 }}>
              <Table>
                <IncomeTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={headLabel}
                  onRequestSort={handleSort}
                  onFilterChange={handleFilterChange}
                  filterTypes={filterTypes}
                  filterOptions={items}
                />
                <TableBody>
                  {loadingIncomes ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomes.map((row) => (
                      <IncomeTableRow
                        key={row.id}
                        row={row}
                        onEdit={() =>
                          handleEditIncome(row.id, row.date, row.amount, row.note, row.item_id)
                        }
                        onDelete={() => handleDeleteIncome(row.id)}
                        loadingDelete={loadingDelete}
                        isDeleting={deleteIncomeId === row.id}
                      />
                    ))
                  )}
                  <TableEmptyRows
                    height={50}
                    emptyRows={emptyRows(page, rowsPerPage, rowCount)}
                  />
                  {notFound && <TableNoData/>}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md" // or another size like "sm", "lg", "xl"
          fullWidth
          sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '80%' } }} // Custom width styling
        >
          <DialogTitle>{isEditMode ? 'Edit Income' : 'Add Income'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={incomeAmount}
                onChange={handleAmountChange}
              />
              <TextField
                margin="dense"
                id="date"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={incomeDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                id="note"
                label="Note"
                type="text"
                fullWidth
                variant="outlined"
                value={incomeNote}
                onChange={handleNoteChange}
              />
              <Autocomplete
                value={selectedItem}
                onChange={(event, newValue) => {
                  handleItemChange(newValue);
                }}
                options={items}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Select Item" />}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleAddIncome}
              color="primary"
              variant="contained"
              disabled={loading || loadingIncomes || loadingDelete}
            >
              {isEditMode ? 'Update' : 'Add'}
              {loading ? <CircularProgress size={14} sx={{ marginLeft: 1 }} />  : ""}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDelete} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this income?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={loadingDelete}
            >
              Delete
              {loadingDelete ? <CircularProgress size={14} sx={{ marginLeft: 1 }} />  : ""}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!successMesage}
          autoHideDuration={6000}
          onClose={handleSuccessClose}
        >
          <MuiAlert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
            {successMesage}
          </MuiAlert>
        </Snackbar>

        <Snackbar open={!!apiError} autoHideDuration={6000} onClose={handleErrorClose}>
          <MuiAlert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
            {apiError}
          </MuiAlert>
        </Snackbar>
      </Container>
    </>
  );
}
