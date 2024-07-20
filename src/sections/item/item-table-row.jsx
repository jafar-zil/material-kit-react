import { useState } from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Iconify from 'src/components/iconify';

ItemTableRow.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};

export default function ItemTableRow({
  name,
  type,
  selected,
  handleClick,
}) {
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={handleClick} />
      </TableCell>

      <TableCell>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2">{name}</Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{type}</TableCell>

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
        <MenuItem onClick={handleClosePopover}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </TableRow>
  );
}
