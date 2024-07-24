import { useState, useEffect,useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchItemsData, addItem, editItem, deleteItem } from 'src/services/apiService';

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
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import ItemTableRow from '../item-table-row';
import ItemTableHead from '../item-table-head';
import TableEmptyRows from '../table-empty-rows';
import { emptyRows } from '../utils';

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [itemName, setItemName] = useState('');
  const [itemType, setItemType] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMesage, setSuccessMesage] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [filters, setFilters] = useState({});

  const headLabel = [
    { id: 'name', label: 'Name', filterType: 'text' },
    { id: 'type', label: 'Type', filterType: 'autocomplete' },
    { id: '',label: '', filterType: null  },
  ];
  
  const filterTypes = {
    name: { filterType: 'text', type: 'contains' },
    type: { filterType: 'text', type: 'equals' },
  };

  const itemTypes = [
    { id: 1, name: "Income" },
    { id: 2, name: "Expense" }
  ];

  const fetchItemsFromAPI =useCallback(async (filterModel, currentPage, currentRowsPerPage, sortOrder, sortBy) => {
    setLoadingItems(true);
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

      const data = await fetchItemsData(payload);
      setItems(data.rowData);
      setRowCount(data.rowCount);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    } finally {
      setLoadingItems(false);
    }
  }, []);

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
    fetchItemsFromAPI(filters, page, rowsPerPage, order, orderBy);
  }, [filters, page, rowsPerPage, order, orderBy, fetchItemsFromAPI]);

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


  const notFound = !items.length && !loadingItems;

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setItemName('');
    setItemType('');
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItemId(null);
  };

  const handleNameChange = (event) => {
    setItemName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setItemType(event.target.value);
  };

  const handleSuccessClose = () => {
    setSuccessMesage(null);
  };

  const handleErrorClose = () => {
    setApiError(null);
  };

  const handleAddItem = async () => {
    setLoading(true);

    try {
      if (isEditMode) {
        await editItem(currentItemId, itemName, itemType);
        setSuccessMesage("Item updated successfully")
      } else {
        await addItem(itemName, itemType);
        setSuccessMesage("Item added successfully")
      }

      fetchItemsFromAPI(filters, page, rowsPerPage, order, orderBy); 
      handleClose();
    } catch (error) {
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (id, name, type) => {
    setCurrentItemId(id);
    setItemName(name);
    if (type === "Income") {
      setItemType(1);
    } else {
      setItemType(2);
    }
    setIsEditMode(true);
    setOpen(true);
  };

  const handleDeleteItem = async (id) => {
    setConfirmDelete(true);
    setDeleteItemId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteItemId) {
      setLoadingDelete(true); // Set loading state for delete
      try {
        await deleteItem(deleteItemId);
        setSuccessMesage("Item deleted successfully")
        fetchItemsFromAPI(filters, page, rowsPerPage, order, orderBy); 
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoadingDelete(false); // Reset loading state
        setConfirmDelete(false);
        setDeleteItemId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteItemId(null);
  };

  return (
    <>
      <Helmet>
        <title>Item List</title>
      </Helmet>

      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Item List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleClickOpen}
          >
            New Item
          </Button>
        </Stack>

        <Card>
          

<Scrollbar>
            <TableContainer sx={{ minWidth: 300 }}>
              <Table>
                <ItemTableHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={headLabel}
                  onRequestSort={handleSort}
                  onFilterChange={handleFilterChange}
                  filterTypes={filterTypes}
                  filterOptions={itemTypes}
                />
                <TableBody>
                  {loadingItems ? (
                    <TableRow>
                    <TableCell colSpan={3}>
                      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={200}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Loading...
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  ) : (
                    items.map((row) => {
                        const { id, name, type } = row;

                        return (
                          <ItemTableRow
                            key={id}
                            id={id}
                            name={name}
                            type={type === '1' ? 'Income' : 'Expense'}
                            onEdit={handleEditItem}
                            onDelete={handleDeleteItem} // Pass handleDeleteItem
                          />
                        );
                      })
                  )}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, rowCount)}
                  />

                  {notFound && <TableNoData/>}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {isEditMode ? 'Edit Item' : 'Add New Item'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              id="name"
              label="Item Name"
              type="text"
              fullWidth
              variant="standard"
              value={itemName}
              onChange={handleNameChange}
            />
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel id="item-type-label">Type</InputLabel>
              <Select
                labelId="item-type-label"
                id="item-type"
                value={itemType}
                label="Type"
                onChange={handleTypeChange}
              >
                <MenuItem value={1}>Income</MenuItem>
                <MenuItem value={2}>Expense</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleAddItem} disabled={loading} variant="contained"
              color="primary">
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          </DialogActions>
        </Dialog>

      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this item?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={loadingDelete} // Disable button when loading
            startIcon={loadingDelete ? <CircularProgress size={20} color="inherit" /> : null} // Add loading indicator
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
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSuccessClose}
          severity="success"
        >
            {successMesage}
        </MuiAlert>
      </Snackbar>

      <Snackbar
        open={Boolean(apiError)}
        autoHideDuration={3000}
        onClose={handleErrorClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleErrorClose}
          severity="error"
        >
          {apiError}
        </MuiAlert>
      </Snackbar>
      </Container>
    </>
  );
}
