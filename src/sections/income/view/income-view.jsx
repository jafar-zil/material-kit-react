import { useState, useEffect } from 'react';
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
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Autocomplete from '@mui/material/Autocomplete';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import IncomeTableRow from '../income-table-row';
import IncomeTableHead from '../income-table-head';
import TableEmptyRows from '../table-empty-rows';
import IncomeTableToolbar from '../income-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  const fetchIncomesFromAPI = async () => {
    setLoadingIncomes(true);
    try {
      const data = await fetchIncomes();
      setIncomes(data);
    } catch (error) {
      console.error('Failed to fetch incomes:', error);
    } finally {
      setLoadingIncomes(false);
    }
  };

  const fetchItemsFromAPI = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  useEffect(() => {
    fetchIncomesFromAPI();
    fetchItemsFromAPI();
  }, []);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = incomes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: incomes,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

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

      fetchIncomesFromAPI();
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
        fetchIncomesFromAPI();
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
          <IncomeTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 300 }}>
              <Table>
                <IncomeTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={[
                    { id: 'date', label: 'Date', alignRight: false },
                    { id: 'amount', label: 'Amount', alignRight: false },
                    { id: 'note', label: 'Note', alignRight: false },
                    { id: '' },
                  ]}
                  rowCount={incomes.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleSort}
                />
                <TableBody>
                  {loadingIncomes ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          height={200}
                        >
                          <CircularProgress size={24} />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Loading...
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => {
                        const { id, date, amount, note, item_id } = row;
                        const isIncomeSelected = selected.indexOf(id) !== -1;

                        return (
                          <IncomeTableRow
                            key={id}
                            id={id}
                            date={date}
                            amount={amount}
                            note={note}
                            itemId={item_id}
                            selected={isIncomeSelected}
                            handleClick={(event) => handleClick(event, id)}
                            onEdit={handleEditIncome}
                            onDelete={handleDeleteIncome}
                          />
                        );
                      })
                  )}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, incomes.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={incomes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditMode ? 'Edit Income' : 'Add New Income'}</DialogTitle>
          <DialogContent>
            {/* Amount Input */}
            <TextField
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              fullWidth
              variant="standard"
              value={incomeAmount}
              onChange={handleAmountChange}
            />

            {/* Date Picker */}
            <FormControl fullWidth margin="dense" variant="standard">
              <TextField
                id="date"
                label="Date"
                type="date"
                fullWidth
                variant="standard"
                value={incomeDate}
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </FormControl>

            {/* Note Input */}
            <TextField
              margin="dense"
              id="note"
              label="Note"
              type="text"
              fullWidth
              variant="standard"
              value={incomeNote}
              onChange={handleNoteChange}
            />

            {/* Item Autocomplete */}
            <Autocomplete
              options={items}
              getOptionLabel={(option) => option.name}
              value={selectedItem}
              onChange={(event, newValue) => handleItemChange(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Item" variant="standard" margin="dense" fullWidth />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              onClick={handleAddIncome}
              disabled={loading}
              variant="contained"
              color="primary"
            >
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDelete} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this income?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete}>Cancel</Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              disabled={loadingDelete}
              startIcon={loadingDelete ? <CircularProgress size={20} color="inherit" /> : null}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={Boolean(successMesage)}
          autoHideDuration={3000}
          onClose={handleSuccessClose}
        >
          <MuiAlert elevation={6} variant="filled" onClose={handleSuccessClose} severity="success">
            {successMesage}
          </MuiAlert>
        </Snackbar>

        <Snackbar open={Boolean(apiError)} autoHideDuration={3000} onClose={handleErrorClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleErrorClose} severity="error">
            {apiError}
          </MuiAlert>
        </Snackbar>
      </Container>
    </>
  );
}
