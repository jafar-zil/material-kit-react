import PropTypes from 'prop-types';
import { Box, TableRow, TableCell, TableHead, TableSortLabel, TextField, Autocomplete, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

ItemTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterTypes: PropTypes.object,
  filterOptions: PropTypes.array,
};

export default function ItemTableHead({
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
    const filterValue = id === 'type' ? newValue?.id : event.target.value;
    const filterType = filterTypes[id]?.filterType || 'text';
    const filterOperation = filterTypes[id]?.type || 'contains';

    setFilterValues(prev => ({ ...prev, [id]: filterValue }));
    onFilterChange(id, filterValue, filterType, filterOperation);
  };

  const handleClearFilter = (id) => () => {
    setFilterValues(prev => ({ ...prev, [id]: '' }));
    onFilterChange(id, '', filterTypes[id]?.filterType || 'text', filterTypes[id]?.type || 'contains');
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
                 <strong>{headCell.label}</strong>
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
                                    xs: '0px',
                                    sm: '0px',
                                  },
                                  height : {xs:6}
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
                              padding: { sm: '6px 8px', xs: '3px 4px' }
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
