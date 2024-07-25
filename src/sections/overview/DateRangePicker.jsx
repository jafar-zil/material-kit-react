import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, MenuItem, Stack } from '@mui/material';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths, subYears, startOfDay, endOfDay, subDays } from 'date-fns';
import Iconify from 'src/components/iconify';

const options = [
    { label: 'Today', range: [format(startOfDay(new Date()), 'yyyy-MM-dd'), format(endOfDay(new Date()), 'yyyy-MM-dd')] },
    { label: 'Yesterday', range: [format(startOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd'), format(endOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd')] },
    { label: 'Last 7 Days', range: [format(startOfDay(subDays(new Date(), 7)), 'yyyy-MM-dd'), format(endOfDay(new Date()), 'yyyy-MM-dd')] },
    { label: 'This Month', range: [format(startOfMonth(new Date()), 'yyyy-MM-dd'), format(endOfMonth(new Date()), 'yyyy-MM-dd')] },
    { label: 'Last Month', range: [format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'), format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')] },
    { label: 'Last 3 Months', range: [format(startOfMonth(subMonths(new Date(), 3)), 'yyyy-MM-dd'), format(endOfMonth(new Date()), 'yyyy-MM-dd')] },
    { label: 'This Year', range: [format(startOfYear(new Date()), 'yyyy-MM-dd'), format(endOfYear(new Date()), 'yyyy-MM-dd')] },
    { label: 'Last Year', range: [format(startOfYear(subYears(new Date(), 1)), 'yyyy-MM-dd'), format(endOfYear(subYears(new Date(), 1)), 'yyyy-MM-dd')] },
    { label: 'All Time', range: ['2020-01-01', '2050-12-31'] },
];

function DateRangePicker({ onDateRangeChange }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedLabel, setSelectedLabel] = useState('All Time');

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = (option) => {
        setSelectedLabel(option.label);
        onDateRangeChange(option.range);
        handleClose();
    };

    return (
        <Stack spacing={2}>
            <Button
                variant="outlined"
                onClick={handleClick}
                startIcon={<Iconify icon="eva:calendar-outline" />}
            >
                {selectedLabel}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {options.map((option) => (
                    <MenuItem key={option.label} onClick={() => handleSelect(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </Stack>
    );
}

DateRangePicker.propTypes = {
    onDateRangeChange: PropTypes.func.isRequired,
};

export default DateRangePicker;
