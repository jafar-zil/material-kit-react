import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { fetchItems } from 'src/services/apiService'; // Import your API service function

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
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';   // New import
import InputLabel from '@mui/material/InputLabel';     // New import
import Select from '@mui/material/Select';             // New import
import MenuItem from '@mui/material/MenuItem';         // New import
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
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [itemName, setName] = useState('');
  const [type, setType] = useState('');

  // Fetch items from the API
  useEffect(() => {
    const getItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    getItems();
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
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleAddItem = () => {
    // Handle the logic for adding the item
    console.log('Name:', itemName);
    console.log('Type:', type);
    handleClose();
  };

  return (
    <Container>
      <Helmet>
        <title>Items | Cashflow</title>
      </Helmet>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Items</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleClickOpen}>
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
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 300 }}>
              <ItemTableHead
                order={order}
                orderBy={orderBy}
                rowCount={items.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'type', label: 'Type' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <ItemTableRow
                      key={row.id}
                      name={row.name}
                      type={row.type === '1' ? 'Income' : 'Expense'} // Conditional rendering
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

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
          page={page}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the new item.
          </DialogContentText>
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
              value={type}
              onChange={handleTypeChange}
              label="Type"
            >
              <MenuItem value={1}>Income</MenuItem>
              <MenuItem value={2}>Expense</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddItem} variant="contained" color="primary">
            Add Item
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
