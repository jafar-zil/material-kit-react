import PropTypes from 'prop-types';
import {
  Box,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  TextField,
  Autocomplete,
  IconButton,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Iconify from 'src/components/iconify';
import { useState } from 'react';
import { format } from 'date-fns';

ExpenseTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterTypes: PropTypes.object,
  filterOptions: PropTypes.array,
};

export default function ExpenseTableHead({
  order,
  orderBy,
  headLabel,
  onRequestSort,
  onFilterChange,
  filterTypes,
  filterOptions = [],
}) {
  const [filterValues, setFilterValues] = useState({});

  const createSortHandler = (id) => (event) => {
    onRequestSort(event, id);
  };

  const handleFilterChange = (id) => (event, newValue) => {
    let filterValue = newValue;
    if (id === 'item_id') {
      filterValue = newValue?.id;
    } else if (id === 'date') {
      filterValue = newValue;
    } else {
      filterValue = event.target.value;
    }

    const formattedValue =
      id === 'date' && filterValue ? format(filterValue, 'yyyy-MM-dd') : filterValue;
    const filterType = filterTypes[id]?.filterType || 'text';
    const filterOperation = filterTypes[id]?.type || 'contains';

    setFilterValues((prev) => ({ ...prev, [id]: filterValue }));
    onFilterChange(id, formattedValue, filterType, filterOperation);
  };

  const handleClearFilter = (id) => () => {
    setFilterValues((prev) => ({ ...prev, [id]: '' }));
    onFilterChange(
      id,
      '',
      filterTypes[id]?.filterType || 'text',
      filterTypes[id]?.type || 'contains'
    );
  };

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.alignRight ? 'right' : 'left'}>
            {headCell.id ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
              </TableSortLabel>
            ) : (
              headCell.label
            )}

            {headCell.filterType && (
              <Box mt={1} display="flex" alignItems="center">
                {(() => {
                  switch (headCell.filterType) {
                    case 'autocomplete':
                      return (
                        <Autocomplete
                          options={filterOptions}
                          getOptionLabel={(option) => option.name}
                          onChange={handleFilterChange(headCell.id)}
                          value={
                            filterOptions.find(
                              (option) => option.id === filterValues[headCell.id]
                            ) || null
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Search"
                              variant="outlined"
                              sx={{
                                width: {
                                  xs: 80,
                                  sm: 120,
                                },
                                '& .MuiOutlinedInput-root': {
                                  fontSize: { xs: '0.6rem', sm: '0.65rem' },
                                  padding: {
                                    xs: '0px',
                                    sm: '0px',
                                  },
                                  paddingRight: '0px',
                                },
                                '& .MuiInputBase-input::placeholder': {
                                  fontSize: { xs: '0.6rem', sm: '0.75rem' },
                                },
                                '& .MuiInputBase-input': {
                                  padding: {
                                    xs: '2px',
                                    sm: '6px 12px',
                                  },
                                },
                              }}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {filterValues[headCell.id] ? (
                                      <IconButton
                                        onClick={handleClearFilter(headCell.id)}
                                        size="small"
                                      >
                                        <Iconify icon="eva:close-fill" />
                                      </IconButton>
                                    ) : (
                                      <Iconify
                                        icon="eva:search-fill"
                                        sx={{
                                          color: 'action.active',
                                          mr: 1,
                                          height: { xs: '0.8rem', sm: '0.8rem' },
                                          width: { xs: '0.8rem', sm: '0.8rem' },
                                        }}
                                      />
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          fullWidth
                          disableClearable
                          forcePopupIcon={false}
                        />
                      );
                    case 'date':
                      return (
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DesktopDatePicker
                            label="Search"
                            sx={{
                              width: {
                                xs: 100, // Width for extra-small screens (mobile)
                                sm: 150, // Width for small screens and above (desktop)
                              },
                            }}
                            value={filterValues[headCell.id] || null}
                            onChange={(newValue) => handleFilterChange(headCell.id)(null, newValue)}
                            format="yyyy-MM-dd"
                            slotProps={{
                              field: {
                                clearable: true,
                                onClear: () => handleClearFilter(headCell.id),
                              },
                            }}
                            slots={{
                              textField: (params) => (
                                <TextField
                                  {...params}
                                  InputProps={{
                                    ...params.InputProps,
                                    sx: {
                                      '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.6rem', sm: '0.875rem' },
                                        height: '1.5em',
                                        padding: { sm: '6px 8px', xs: '3px 4px' }, // Adjust padding to ensure proper spacing
                                      },
                                      '& .MuiOutlinedInput-root': {
                                        padding: '0 8px', // Ensure outer padding aligns with input
                                      },
                                      '& .MuiSvgIcon-root': {
                                        fontSize: { xs: '0.6rem', sm: '1rem' }, // Adjust icon size
                                        marginRight: '0px', // Reduce margin between icon and text
                                      },
                                      '& .MuiIconButton-root': {
                                        padding: '2px', // Adjust icon size
                                      },
                                    },
                                  }}
                                  InputLabelProps={{
                                    ...params.InputLabelProps,
                                    sx: {
                                      fontSize: {
                                        xs: '0.6em', // Smaller font size for mobile
                                        sm: '0.8em', // Default font size for desktop
                                      },
                                      top: {
                                        xs: '0px', // Adjust top position for mobile
                                        sm: '2px', // Top position for desktop
                                      },
                                      transform: {
                                        xs: 'translate(10px, 5px) scale(1)', // Position for mobile
                                        sm: 'translate(14px, 8px) scale(1)', // Position for desktop
                                      },
                                      '&.MuiInputLabel-shrink': {
                                        transform: {
                                          xs: 'translate(10px, -2px) scale(0.75)', // Shrunk state for mobile
                                          sm: 'translate(14px, -6px) scale(0.75)', // Shrunk state for desktop
                                        },
                                      },
                                    },
                                  }}
                                />
                              ),
                            }}
                          />
                        </LocalizationProvider>
                      );
                    default:
                      return (
                        <TextField
                          variant="outlined"
                          size="small"
                          sx={{
                            width: {
                              xs: 70,
                              sm: 110,
                            },
                            '& .MuiOutlinedInput-root': {
                              fontSize: { xs: '0.6rem', sm: '0.75rem' },
                              padding: {
                                xs: '0px',
                                sm: '0px',
                              },
                            },
                            '& .MuiInputBase-input::placeholder': {
                              fontSize: { xs: '0.6rem', sm: '0.75rem' },
                            },
                            '& .MuiInputBase-input': {
                              padding: {
                                xs: '2px',
                                sm: '6px 12px',
                              },
                            },
                          }}
                          placeholder="Search"
                          value={filterValues[headCell.id] || ''}
                          onChange={handleFilterChange(headCell.id)}
                          InputProps={{
                            endAdornment: (
                              <>
                                {filterValues[headCell.id] ? (
                                  <IconButton onClick={handleClearFilter(headCell.id)} size="small">
                                    <Iconify icon="eva:close-fill" />
                                  </IconButton>
                                ) : (
                                  <Iconify
                                    icon="eva:search-fill"
                                    sx={{ color: 'action.active', mr: 1 }}
                                  />
                                )}
                              </>
                            ),
                          }}
                        />
                      );
                  }
                })()}
              </Box>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
