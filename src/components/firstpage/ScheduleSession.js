import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const ScheduleSession = ({ userTimezone, onSchedule }) => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleSubmit = () => {
        // Convert the selected date to UTC
        const dateInUTC = dayjs.tz(selectedDate, userTimezone).utc().format();
        onSchedule(dateInUTC);
    };

    return (
        <div>
            <TextField
                label="Select Date and Time"
                type="datetime-local"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{
                    shrink: true,
                }}
                fullWidth
            />
            <Button onClick={handleSubmit} variant="contained" color="primary">
                Schedule Session
            </Button>
        </div>
    );
};

export default ScheduleSession;