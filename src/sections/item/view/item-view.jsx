import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchItems, addItem, editItem } from 'src/services/apiService'; // Import your API service functions

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
// import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import TableNoData from '../table-no-data';
import ItemTableRow from '../item-table-row';
import ItemTableHead from '../item-table-head';
import TableEmptyRows from '../table-empty-rows';
import ItemTableToolbar from '../item-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function ItemPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [itemName, setItemName] = useState(''); // Renamed to avoid conflict
  const [itemType, setItemType] = useState(''); // Renamed to avoid conflict
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null); // Renamed to avoid conflict
  const [success, setSuccess] = useState(false);

  // Fetch items from the API
  const fetchItemsFromAPI = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  useEffect(() => {
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
      const newSelecteds = items.map((n) => n.name);
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
    inputData: items,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleClickOpen = () => {
    setOpen(true);
    setIsEditMode(false); // Set mode to add
    setItemName(''); // Reset form fields
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
    setSuccess(false);
  };

  // Show an error toast
  const handleErrorClose = () => {
    setApiError(null);
  };

  const handleAddItem = async () => {
    setLoading(true);

    try {
      if (isEditMode) {
        // Edit item mode
        await editItem(currentItemId, itemName, itemType);
        setSuccess(true);
      } else {
        // Add item mode
        await addItem(itemName, itemType);
        setSuccess(true);
      }

      fetchItemsFromAPI(); // Refresh items list
      handleClose();
    } catch (error) {
      console.error('Failed to add/edit item:', error);
      setApiError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const getButtonLabel = () => {
    if (loading) {
      return <CircularProgress size={24} />;
    }
    return isEditMode ? 'Update Item' : 'Add Item';
  };

  // Handle edit initiation
  const handleEditOpen = (id, name, type) => {
    setOpen(true);
    setIsEditMode(true);
    setCurrentItemId(id);
    setItemName(name);
    if(type === "Income"){
      setItemType(1);
    }else{
      setItemType(2);
    }

    console.log(itemType);
  };

  return (
    <Container>
      <Helmet>
        <title> Items | YourAppName </title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Items
        </Typography>
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
          New Item
        </Button>
      </Stack>

      <Card>
        <ItemTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 300 }}>
            <Table>
              <ItemTableHead
                order={order}
                orderBy={orderBy}
                headLabel={[
                  { id: 'name', label: 'Name', alignRight: false },
                  { id: 'type', label: 'Type', alignRight: false },
                  { id: '' },
                ]}
                rowCount={items.length}
                numSelected={selected.length}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleSort}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    const { id, name, type } = row;
                    const isSelected = selected.indexOf(name) !== -1;

                    return (
                      <ItemTableRow
                        key={id}
                        id={id}
                        name={name}
                        type={type === '1' ? 'Income' : 'Expense'} // Conditional rendering
                        selected={isSelected}
                        handleClick={(event) => handleClick(event, name)}
                        onEdit={handleEditOpen} // Pass edit handler
                      />
                    );
                  })}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, items.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditMode ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        <DialogContent>
        
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={itemName}
            onChange={handleNameChange}
          />
        <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="type-label">Type</InputLabel>
            <Select
              labelId="type-label"
              id="type"
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
          <Button
            onClick={handleAddItem}
            disabled={loading}
            variant="contained"
            color="primary"
          >
            {getButtonLabel()}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Success Snackbar */}
      <Snackbar open={success} autoHideDuration={6000} onClose={handleSuccessClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSuccessClose}
          severity="success"
        >
          Item {isEditMode ? 'updated' : 'added'} successfully!
        </MuiAlert>
      </Snackbar>

      {/* Error Snackbar */}
      {apiError && (
        <Snackbar open={Boolean(apiError)} autoHideDuration={6000} onClose={handleErrorClose}>
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={handleErrorClose}
            severity="error"
          >
            {apiError}
          </MuiAlert>
        </Snackbar>
      )}
    </Container>
  );
}
