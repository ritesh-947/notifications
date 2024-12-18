import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './SessionBook.css';

import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    CircularProgress,
    Container,
    Card,
    CardContent,
    Tooltip,
    IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info'; // Tooltip icon
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

const SessionBook = () => {
    const { session_id } = useParams();
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [date, setDate] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [durationOptions, setDurationOptions] = useState([]);
    const [selectedDuration, setSelectedDuration] = useState('');
    const [thoughts, setThoughts] = useState('');
    const [availableStartTimes, setAvailableStartTimes] = useState([]);
    const [bookedSlots, setBookedSlots] = useState([]);

    // Axios instance with session ID attached
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5003', // Update this to your backend API base URL
        // baseURL: 'https://schedule-server-1.onrender.com', // Update this to your backend API base URL
    });

    // Attach `sessionId` from localStorage
    axiosInstance.interceptors.request.use((config) => {
        const sessionId = localStorage.getItem('sessionId');
        if (sessionId) {
            config.headers['Authorization'] = `Session ${sessionId}`;
        }
        return config;
    });

    // Fetch session details
    useEffect(() => {
        const fetchSessionData = async () => {
            try {
                const response = await axiosInstance.get(`/session/${session_id}`);
                console.log('[DEBUG] Fetched session data:', response.data); // Log data
                const session = response.data;
                setSessionData(session);
                console.log('[DEBUG] Fetched session data:', session); // Debug log

                // Generate start times based on availability period
                const times = [];
                const start = moment(session.availability_timeperiod.start, 'hh:mm A');
                const end = moment(session.availability_timeperiod.end, 'hh:mm A');
                while (start.isBefore(end)) {
                    times.push(start.format('hh:mm A'));
                    start.add(1, 'hour');
                }
                setAvailableStartTimes(times);

                // Set duration options
                if (session.duration === '15 minutes') {
                    setDurationOptions([15]);
                } else if (session.duration === '30 minutes') {
                    setDurationOptions([30]);
                } else if (session.duration === 'both') {
                    setDurationOptions([15, 30]);
                }
            } catch (err) {
                setError('Failed to fetch session details.');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [session_id]);

    // Fetch booked slots for the selected date
    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!date) return;

            try {
                const formattedDate = moment(date).format('YYYY-MM-DD');
                const response = await axiosInstance.get(`/session/${session_id}/booked-slots`, {
                    params: { date: formattedDate },
                });
                setBookedSlots(response.data.booked_slots);
            } catch (err) {
                console.error('[ERROR] Failed to fetch booked slots:', err.response?.data || err.message);
            }
        };

        fetchBookedSlots();
    }, [date, session_id]);

    // Filter out booked slots
    const filterAvailableTimes = () => {
        const formattedBookedSlots = bookedSlots.map((slot) => ({
            start: moment(slot.start_time, 'HH:mm:ss'),
            end: moment(slot.end_time, 'HH:mm:ss'),
        }));

        return availableStartTimes.filter((time) => {
            const startTimeMoment = moment(time, 'hh:mm A');
            const endTimeMoment = startTimeMoment.clone().add(selectedDuration, 'minutes');
            return !formattedBookedSlots.some(
                (slot) => startTimeMoment.isBefore(slot.end) && endTimeMoment.isAfter(slot.start)
            );
        });
    };

    const handleBooking = async () => {
        if (!date || !startTime || !selectedDuration) {
            alert('Please fill all required fields.');
            return;
        }

        try {
            const bookingDate = moment(date).format('YYYY-MM-DD');
            const endTime = moment(`${bookingDate} ${startTime}`, 'YYYY-MM-DD hh:mm A')
                .add(selectedDuration, 'minutes')
                .format('hh:mm A');

            const payload = {
                session_id,
                date: bookingDate,
                start_time: startTime,
                end_time: endTime,
                creator_timezone: 'Asia/Kolkata',
                attendee_timezone: 'Asia/Kolkata',
                duration: selectedDuration,
                thoughts,
                mode: 'online',
            };

            const response = await axiosInstance.post('/sessions/book', payload);
            alert(`Session booked successfully! Room ID: ${response.data.booking.room_id}`);
        } catch (err) {
            console.error('[ERROR] Booking failed:', err.response?.data || err.message);
            alert('Failed to book the session. Please try again.');
        }
    };

   // Disable unavailable dates in the DatePicker
   const isDateAvailable = (date) => {
    if (!sessionData || !sessionData.availability_days) {
        console.log('[DEBUG] No session data or availability_days found.');
        return false; // Disable all dates
    }

    const availableDays = sessionData.availability_days.map((day) => day.toLowerCase());
    const selectedDay = moment(date).format('dddd').toLowerCase();

    console.log('[DEBUG] Checking date:', moment(date).format('YYYY-MM-DD'), 'Selected day:', selectedDay);
    console.log('[DEBUG] Available days:', availableDays);

    return availableDays.includes('all day') || availableDays.includes(selectedDay);
};

    if (loading) {
        return (
            <Container>
                <CircularProgress />
                <Typography>Loading session details...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
          <Card sx={{ padding: 1, marginTop: 6, borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                <Typography variant="h6"  gutterBottom sx={{ color: 'green', marginTop:"-1rem", fontSize:"1.1rem" }} >
    Book Session: {sessionData.session_title}
    <Tooltip title="Booking Time must be at least 2 hours after the current time.">
        <IconButton>
            <InfoIcon />
        </IconButton>
    </Tooltip>
</Typography>

<FormControl fullWidth margin="normal" sx={{ zIndex: 2 }}>
                        <Typography variant="">Select Date</Typography>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Select a date"
                            minDate={new Date()} // Disallow past dates
                            filterDate={isDateAvailable} 
                        />
                    </FormControl>

                    <FormControl fullWidth margin="normal" sx={{ '& .MuiInputBase-root': { height: '2.5rem' } , marginTop: '1rem' }}>
    <InputLabel id="duration-label" sx={{ fontSize: '0.9rem' }}>Select Duration</InputLabel>
    <Select
        labelId="duration-label"
        value={selectedDuration}
        onChange={(e) => setSelectedDuration(e.target.value)}
        sx={{
            height: '2.5rem', // Adjust height of the select input
            fontSize: '0.9rem', // Adjust font size inside the select input
           
            
        }}
    >
        {durationOptions.map((opt) => (
            <MenuItem 
                key={opt} 
                value={opt} 
                sx={{
                    fontSize: '0.9rem', // Adjust font size of menu items
                    lineHeight: '1.2', // Adjust line height for a compact look
                    paddingY: '4px', // Reduce vertical padding
                }}
            >
                {opt} minutes
            </MenuItem>
        ))}
    </Select>
</FormControl>

<FormControl fullWidth margin="normal" sx={{ '& .MuiInputBase-root': { height: '2.5rem' }, marginTop: '1rem' }}>
    <InputLabel id="start-time-label" sx={{ fontSize: '0.9rem' }}>Select Start Time</InputLabel>
    <Select
        labelId="start-time-label"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        sx={{
            height: '2.5rem', // Adjust height of the select input
            fontSize: '0.9rem', // Adjust font size inside the select input
        }}
    >
        {filterAvailableTimes().map((time) => (
            <MenuItem 
                key={time} 
                value={time} 
                sx={{
                    fontSize: '0.9rem', // Adjust font size of menu items
                    lineHeight: '1.2', // Adjust line height for a compact look
                    paddingY: '4px', // Reduce vertical padding
                }}
            >
                {time}
            </MenuItem>
        ))}
    </Select>
</FormControl>

                    <TextField
                        label="Your Thoughts (Recommended)"
                        multiline
                        rows={1}
                        fullWidth
                        margin="normal"
                        value={thoughts}
                        onChange={(e) => setThoughts(e.target.value)}
                        placeholder="Describe your issue or topic here, you wanna discuss.."
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleBooking}
                        disabled={!date || !startTime || !selectedDuration}
                    >
                        Book Session
                    </Button>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SessionBook;