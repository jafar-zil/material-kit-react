import { useState } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Iconify from 'src/components/iconify';

ExpenseTableRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    note: PropTypes.string,
    item_id: PropTypes.string, // Adjusted prop name
    item_name: PropTypes.string, // Adjusted prop name
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default function ExpenseTableRow({ row, onEdit, onDelete }) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleEdit = () => {
    handleClosePopover();
    onEdit(row.id, row.date, row.amount, row.note, row.item_id); // Pass item_id to onEdit
  };

  const handleDelete = () => {
    handleClosePopover();
    onDelete(row.id);
  };

  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">{row.date}</Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{row.amount}</TableCell>
      <TableCell align="left">{row.note}</TableCell>
      <TableCell align="left">{row.item_name}</TableCell>

      <TableCell align="right">
        <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
      <Popover
        open={Boolean(openPopover)}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 160 },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </TableRow>
  );
}
