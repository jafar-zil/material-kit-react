import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  fetchItems,
  fetchExpenses,
  addExpense,
  editExpense,
  deleteExpense,
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
import ExpenseTableRow from '../expense-table-row';
import ExpenseTableHead from '../expense-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows } from '../utils';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMesage, setSuccessMesage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteExpenseId, setDeleteExpenseId] = useState(null);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [expenseAmount, setAmount] = useState('');
  const [expenseDate, setDate] = useState('');
  const [expenseNote, setNote] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({});

  const headLabel = [
    { id: 'date', label: 'Date', filterType: 'date' },
    { id: 'amount', label: 'Amount', filterType: 'number' },
    { id: 'note', label: 'Note', filterType: 'text' },
    { id: 'item_id', label: 'Item', filterType: 'autocomplete' },
    { id: '', label: '', filterType: null },
  ];

  const filterTypes = {
    amount: { filterType: 'text', type: 'contains' },
    date: { filterType: 'text', type: 'equals' },
    note: { filterType: 'text', type: 'contains' },
    item_id: { filterType: 'text', type: 'equals' }
  };
  const fetchExpensesFromAPI = useCallback(async (filterModel, currentPage, currentRowsPerPage, sortOrder, sortBy) => {
    setLoadingExpenses(true);
    try {
      const startRow = currentPage * currentRowsPerPage;
      const endRow = startRow + currentRowsPerPage;
      const sortModel = sortBy ? [{ colId: sortBy, sort: sortOrder }] : [];

      const payload = {
        startRow,
        endRow,
        filterModel,
        sortModel,
      };

      const data = await fetchExpenses(payload);
      setExpenses(data.rowData);
      setRowCount(data.rowCount);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  }, []);

  const fetchItemsFromAPI = useCallback(async () => {
    const data = await fetchItems(2);
    setItems(data);
  }, []);

  const handleFilterChange = (id, value, filterType, type) => {
    setFilters((prevFilters) => {
      const restFilters = { ...prevFilters };
      delete restFilters[id];

      if (value === '' || value === null) {
        return restFilters;
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
    fetchExpensesFromAPI(filters, page, rowsPerPage, order, orderBy);
  }, [filters, page, rowsPerPage, order, orderBy, fetchExpensesFromAPI]);

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


  const notFound = !expenses.length && !loadingExpenses;

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setNote('');
    setDate('');
    setAmount('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentExpenseId(null);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

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

  const handleAddExpense = async () => {
    setLoading(true);

    try {
      const expenseData = {
        amount: expenseAmount,
        date: expenseDate,
        item_id: selectedItem?.id,
        note: expenseNote,
      };

      if (isEditMode) {
        await editExpense(currentExpenseId, expenseData);
        setSuccessMesage('Expense updated successfully');
      } else {
        await addExpense(expenseData);
        setSuccessMesage('Expense added successfully');
      }

      fetchExpensesFromAPI(filters, page, rowsPerPage, order, orderBy);
      handleClose();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditExpense = (id, date, amount, note, itemId) => {
    setCurrentExpenseId(id);
    setNote(note);
    setDate(date);
    setAmount(amount);

    const itemIdNum = Number(itemId);
    const itemToSelect = items.find((item) => item.id === itemIdNum);

    setSelectedItem(itemToSelect || null);

    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteExpense = async (id) => {
    setConfirmDelete(true);
    setDeleteExpenseId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteExpenseId) {
      setLoadingDelete(true);
      try {
        await deleteExpense(deleteExpenseId);
        setSuccessMesage('Expense deleted successfully');
        fetchExpensesFromAPI(filters, page, rowsPerPage, order, orderBy);
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoadingDelete(false);
        setConfirmDelete(false);
        setDeleteExpenseId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteExpenseId(null);
  };

  return (
    <>
      <Helmet>
        <title>Expense List</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Expense List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleClickOpen}
          >
            New Expense
          </Button>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 300 }}>
              <Table>
                <ExpenseTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={headLabel}
                  onRequestSort={handleSort}
                  onFilterChange={handleFilterChange}
                  filterTypes={filterTypes}
                  filterOptions={items}
                />
                <TableBody>
                  {loadingExpenses ? (
                    <TableRow>
                      <TableCell align="center" colSpan={5}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Loading...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((row) => (
                      <ExpenseTableRow
                        key={row.id}
                        row={row}
                        onEdit={() =>
                          handleEditExpense(row.id, row.date, row.amount, row.note, row.item_id)
                        }
                        onDelete={() => handleDeleteExpense(row.id)}
                        loadingDelete={loadingDelete}
                        isDeleting={deleteExpenseId === row.id}
                      />
                    ))
                  )}
                  <TableEmptyRows
                    height={50}
                    emptyRows={emptyRows(page, rowsPerPage, rowCount)}
                  />
                  {notFound && <TableNoData />}
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
          maxWidth="md"
          fullWidth
          sx={{ '& .MuiDialog-paper': { width: '600px', maxWidth: '80%' } }}
        >
          <DialogTitle>{isEditMode ? 'Edit Expense' : 'Add Expense'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                margin="dense"
                id="amount"
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={expenseAmount}
                onChange={handleAmountChange}
              />
              <TextField
                margin="dense"
                id="date"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                value={expenseDate}
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
                value={expenseNote}
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
              onClick={handleAddExpense}
              color="primary"
              variant="contained"
              disabled={loading || loadingExpenses || loadingDelete}
            >
              {isEditMode ? 'Update' : 'Add'}
              {loading ? <CircularProgress size={14} sx={{ marginLeft: 1 }} /> : ""}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDelete} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this expense?
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
              {loadingDelete ? <CircularProgress size={14} sx={{ marginLeft: 1 }} /> : ""}
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
