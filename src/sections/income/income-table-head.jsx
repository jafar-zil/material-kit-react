import PropTypes from 'prop-types';
import { Box, TableRow, TableCell, TableHead, TableSortLabel, TextField, Autocomplete, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useState } from 'react';

IncomeTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func,
  onFilterChange: PropTypes.func,
  filterTypes: PropTypes.object,
  filterOptions: PropTypes.array,
};

export default function IncomeTableHead({
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
    const filterValue = id === 'item_id' ? newValue?.id : event.target.value;
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
                          value={filterOptions.find(option => option.id === filterValues[headCell.id]) || null}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder='Search'
                              variant="standard"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {filterValues[headCell.id] && (
                                      <IconButton
                                        onClick={handleClearFilter(headCell.id)}
                                        size="small"
                                      >
                                        <Iconify icon="eva:close-fill" />
                                      </IconButton>
                                    )}
                                    {params.InputProps.endAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          fullWidth
                          disableClearable
                        />
                      );
                    case 'date':
                      return (
                        <TextField
                          type="date"
                          variant="standard"
                          size="small"
                          fullWidth
                          placeholder='Search'
                          value={filterValues[headCell.id] || ''}
                          onChange={handleFilterChange(headCell.id)}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            endAdornment: (
                              <>
                                {filterValues[headCell.id] && (
                                  <IconButton
                                    onClick={handleClearFilter(headCell.id)}
                                    size="small"
                                  >
                                    <Iconify icon="eva:close-fill" />
                                  </IconButton>
                                )}
                              </>
                            ),
                          }}
                        />
                      );
                    default:
                      return (
                        <TextField
                          variant="standard"
                          size="small"
                          fullWidth
                          placeholder='Search'
                          value={filterValues[headCell.id] || ''}
                          onChange={handleFilterChange(headCell.id)}
                          InputProps={{
                            endAdornment: (
                              <>
                                {filterValues[headCell.id] && (
                                  <IconButton
                                    onClick={handleClearFilter(headCell.id)}
                                    size="small"
                                  >
                                    <Iconify icon="eva:close-fill" />
                                  </IconButton>
                                )}
                                <Iconify
                                  icon="eva:search-fill"
                                  sx={{ color: 'action.active', mr: 1 }}
                                />
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
