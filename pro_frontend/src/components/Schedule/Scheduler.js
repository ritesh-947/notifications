import React, { useState, useEffect, useCallback,useContext } from 'react';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import apiClient from './apiClient';
import { AvailabilityContext } from '../AvailabilityContext';
import {
    Button,
    CircularProgress,
    Container,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Card,
    CardContent
} from '@mui/material';
import TimezoneDisplay from './TimezoneDisplay';
import './Scheduler.css'; // Import the CSS file for custom styles

const Scheduler = ({ setupData }) => {
    const { sessionId } = useParams();
    const [date, setDate] = useState(null);
    const [timezone, setTimezone] = useState('');
    const [creatorTimezone, setCreatorTimezone] = useState('Asia/Kolkata');
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState(''); // Store the selected time
    const [bookingMessage, setBookingMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [durationOptions, setDurationOptions] = useState([]);
    const [duration, setDuration] = useState('');
    const [isCreator, setIsCreator] = useState(false);
    const [availabilityDays, setAvailabilityDays] = useState([]);
    const { availableDates, setAvailableDates } = useContext(AvailabilityContext); // Access context values


        // Function to refresh tokens
    const refreshToken = async () => {
        try {
          const response = await apiClient.post('/api/auth/refresh', {}, {
            baseURL: 'http://localhost:8080',
            withCredentials: true,
          });
          console.log('Token refreshed successfully:', response.data.message);
          return true;
        } catch (error) {
          console.error('Error refreshing token:', error.response?.data || error.message);
          return false;
        }
      };
  

     
      const fetchAvailableDates = useCallback(async () => {
        try {
            // Fetch available dates from the API
            const response = await apiClient.get(`/api/sessions/${sessionId}/availability`, {
                baseURL: 'http://localhost:5003',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const availableDates = response.data.available_dates;
            setAvailableDates(availableDates); // Update state with available dates
            setLoading(false); // Set loading to false on success
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn('Access token expired, attempting refresh...');
                const refreshed = await refreshToken();
                if (refreshed) {
                    console.log('Retrying fetchAvailableDates after token refresh...');
                    fetchAvailableDates(); // Retry fetching after refreshing token
                } else {
                    console.error('Token refresh failed. Redirecting to login...');
                    // Handle failed refresh logic (e.g., redirect to login)
                }
            } else {
                console.error('Error fetching available dates:', error);
            }
            setLoading(false); // Ensure loading is false even on failure
        }
    }, [sessionId, setAvailableDates, refreshToken]);

    useEffect(() => {
        fetchAvailableDates();
    }, [fetchAvailableDates]);

   
      // Function to check if the date is in the available dates list
      const isDateAvailable = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        return availableDates.includes(formattedDate);
    };


    /// Fetch session data for available slots and durations
useEffect(() => {
    const fetchSessionData = async () => {
        try {
            if (!date || !timezone) {
                setBookingMessage('Please select a date and timezone first.');
                return;
            }

            const response = await apiClient.get(`/session/${sessionId}/timeslots`, {
                params: { 
                    date: moment(date).format('YYYY-MM-DD'), 
                    timezone 
                },
                baseURL: 'http://localhost:5003',
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 404 || !response.data) {
                setBookingMessage('Session not found. Please try again later.');
                return;
            }

            const { 
                duration: sessionDuration, 
                isCreator, 
                availability_days: sessionAvailabilityDays, 
                available_times: availableTimes 
            } = response.data;

            setIsCreator(isCreator);
            setAvailabilityDays(sessionAvailabilityDays || []); // Store availability_days in state
            console.log('Availability Days:', sessionAvailabilityDays); // Debugging purposes

            if (sessionDuration === '15 minutes') {
                setDurationOptions([15]);
                setDuration(15);
            } else if (sessionDuration === '30 minutes') {
                setDurationOptions([30]);
                setDuration(30);
            } else if (sessionDuration === 'both') {
                setDurationOptions([15, 30]);
            }

            setAvailableTimes(availableTimes || []);
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn('Access token expired, attempting refresh...');
                const refreshed = await refreshToken();
                if (refreshed) {
                    fetchSessionData(); // Retry fetching session data after refreshing token
                } else {
                    console.error('Token refresh failed. Redirecting to login...');
                    setBookingMessage('Your session has expired. Please log in again.');
                }
            } else {
                console.error('Error fetching session data:', error);
                setBookingMessage('An error occurred while fetching session data. Please try again later.');
            }
        } finally {
            setLoading(false); // Ensure loading state is always updated
        }
    };

    if (sessionId) {
        fetchSessionData();
    }
}, [sessionId, date, timezone]);


    const fetchAvailableSessions = useCallback(async () => {
        if (!date || !timezone || !duration) return;

        setLoading(true);

        try {
            setBookingMessage('');
            const formattedDate = moment(date).format('YYYY-MM-DD');
            const response = await apiClient.get(`/session/${sessionId}/timeslots`, {
                baseURL: 'http://localhost:5003',
                params: { date: formattedDate, timezone, duration },
                withCredentials: true,
            });

            let times = response.data.available_times || [];

            // Create a deep copy to modify times safely
            times = times.map((timeObj) => ({ ...timeObj }));

            // Rule: If any XX:00 slot is booked, mark the corresponding XX:30 slot as unbookable
            times.forEach((timeObj) => {
                const timeMoment = moment(timeObj.time, 'hh:mm A');
                const minutes = timeMoment.minutes();

                // Check if the XX:00 slot is booked (for any duration)
                if (minutes === 0 && timeObj.booked) {
                    const corresponding30MinSlot = times.find(t => {
                        const correspondingTimeMoment = moment(t.time, 'hh:mm A');
                        const correspondingMinutes = correspondingTimeMoment.minutes();
                        return correspondingMinutes === 30 && correspondingTimeMoment.isSame(timeMoment.clone().add(30, 'minutes'));
                    });

                    if (corresponding30MinSlot) {
                        corresponding30MinSlot.booked = true;
                    }
                }
            });

            // Rule 7: If XX:30 for 15 minutes is booked, then XX:00 for any duration should be unbookable
            times.forEach((timeObj) => {
                const timeMoment = moment(timeObj.time, 'hh:mm A');
                const minutes = timeMoment.minutes();

                if (minutes === 30 && timeObj.booked && timeObj.duration === 15) {
                    const corresponding00MinSlot = times.find(t => {
                        const correspondingTimeMoment = moment(t.time, 'hh:mm A');
                        return correspondingTimeMoment.isSame(timeMoment.clone().subtract(30, 'minutes'));
                    });

                    if (corresponding00MinSlot) {
                        corresponding00MinSlot.booked = true;
                    }
                }
            });

            // Rule 9: If XX:00 is booked for either duration, then the other duration at XX:00 should also be unbookable
            times.forEach((timeObj) => {
                const timeMoment = moment(timeObj.time, 'hh:mm A');
                const minutes = timeMoment.minutes();

                if (minutes === 0 && timeObj.booked) {
                    const corresponding00MinSlotOtherDuration = times.find(t => {
                        const correspondingTimeMoment = moment(t.time, 'hh:mm A');
                        return correspondingTimeMoment.isSame(timeMoment) && t.duration !== timeObj.duration;
                    });

                    if (corresponding00MinSlotOtherDuration) {
                        corresponding00MinSlotOtherDuration.booked = true;
                    }
                }
            });

            
            // Filter logic based on the selected duration
            if (duration === 30) {
                times = times.filter(timeObj => moment(timeObj.time, 'hh:mm A').minutes() === 0);
            } else if (duration === 15) {
                times = times.filter(timeObj => moment(timeObj.time, 'hh:mm A').minutes() === 0 || moment(timeObj.time, 'hh:mm A').minutes() === 30);
            }

            setAvailableTimes(times);

        } catch (error) {
            if (error.response?.status === 401) {
                console.warn('Access token expired, attempting refresh...');
                const refreshed = await refreshToken();
                if (refreshed) {
                  fetchAvailableSessions(); // Retry fetching videos after refreshing token
                }
              }
            setBookingMessage('Error fetching available sessions. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [date, timezone, sessionId, duration]);

    // Re-fetch sessions when date, timezone, or duration changes
    useEffect(() => {
        if (date && timezone && duration) {
            fetchAvailableSessions();
        }
    }, [date, timezone, duration, fetchAvailableSessions]);

    const handleTimezoneChange = (selectedTimezone) => {
        setTimezone(selectedTimezone);
        setAvailableTimes([]); // Clear available times when timezone changes
        fetchAvailableSessions(); // Refetch available sessions
    };


    // The isDayAvailable function checks if the selected day is in availabilityDays
const isDayAvailable = (date) => {
    const day = moment(date).format('dddd'); // Get day of the week (e.g., 'Monday', 'Tuesday')
    return availabilityDays.includes(day); // Check if the day is available
};
    

    const bookSession = async (session_id) => {

        try {
            if (!selectedTime) {
                setBookingMessage('Please select a time.');
                return;
            }

            setLoading(true);

            const bookingTimeInCreatorTZ = moment.tz(`${moment(date).format('YYYY-MM-DD')} ${selectedTime}`, 'YYYY-MM-DD hh:mm A', timezone).clone().tz(creatorTimezone);
            const bookingDate = moment(date).format('YYYY-MM-DD');
            const startTime = bookingTimeInCreatorTZ.format('hh:mm A');
            const endTime = bookingTimeInCreatorTZ.add(parseInt(duration, 10), 'minutes').format('hh:mm A');

           

                 // Include session_reason and mode from setupData in the booking request
            const payload = {
                session_id,
                start_time: startTime,
                end_time: endTime,
                timezone: creatorTimezone,
                duration,
                bookingDate,
                session_reason: setupData.session_reason, // Add session_reason
                mode: setupData.mode, // Add mode
            };
            const response = await apiClient.post(`http://localhost:5003/sessions/book`,  payload,
                { session_id, start_time: startTime, end_time: endTime, timezone: creatorTimezone, duration: duration, bookingDate },
                { withCredentials: true });


            console.log('Booking payload:', payload);
            setBookingMessage(`Your session is scheduled successfully from ${moment(response.data.start_time, 'HH:mm:ss').format('hh:mm A')} to ${moment(response.data.end_time, 'HH:mm:ss').format('hh:mm A')}`);
            fetchAvailableSessions();
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn('Access token expired, attempting refresh...');
                const refreshed = await refreshToken();
                if (refreshed) {
                    bookSession(session_id); // Retry with the session_id
                }
              }
            // If the error is due to creator trying to book their own session
        if (error.response &&  error.response.data.error === 'Creator cannot book their own session') {
            setBookingMessage("Oops... Creator can't book their own session.");
        } else if (error.response && error.response.status === 500) {
            setBookingMessage("An internal server error occurred. Please try again later.");
        }  // Generic fallback for other errors
        else {
            setBookingMessage('Error booking session. Please try again.');
        }
    }finally {
            setLoading(false);
        }
    };


    
    return (
        
        <Container maxWidth="md">
            <Card variant="outlined" sx={{ mt: 7 }}>
                
                <CardContent>
                    
                    <Typography variant="h4" component="h2" gutterBottom>
                        Schedule Your Session Here!
                    </Typography>

                    {/* Date Picker */}
                    <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
                        <Typography variant="h6">Select Date</Typography>
                        <DatePicker
                            selected={date}
                            onChange={(date) => setDate(date)}
                            dateFormat="yyyy-MM-dd"
                            className="date-picker"
                            // filterDate={isDateAvailable} // Only show available dates
                            placeholderText="Click to select a date"
                            filterDate={isDateAvailable} // Only show available dates
                        />
                    </FormControl>

                    {/* Timezone Display */}
                    <TimezoneDisplay onChange={(continent, country, selectedTimezone) => handleTimezoneChange(selectedTimezone)} />
                    <Typography variant="body2" color="textSecondary">
                        {timezone && creatorTimezone === timezone ? `Your and the creator's timezones are the same: ${timezone}.` : ''}
                    </Typography>

                    {/* Duration Selection */}
                    <FormControl fullWidth sx={{ mt: 4, zIndex: 1007 }}>
                        <InputLabel id="duration-label">Select Duration</InputLabel>
                        <Select
                            labelId="duration-label"
                            value={duration}
                            onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                            disabled={durationOptions.length === 0}
                        >
                            <MenuItem value="" disabled>Select Duration</MenuItem>
                            {durationOptions.map(option => (
                                <MenuItem key={option} value={option}>{option} minutes</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Available Times */}
                    <div className="timeslots-section">
                        <Typography variant="h6" sx={{ mt: 7 }}>Available Slots</Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : date && timezone && duration ? (
                            availableTimes.length > 0 ? (
                                <Grid container spacing={2} sx={{ mt: 0 }}>
                                    {availableTimes.map(({ time, booked }) => (
                                        <Grid item xs={4} key={time}>
                                            <Button
                                                variant={time === selectedTime ? 'contained' : booked ? 'contained' : 'outlined'}
                                                color={time === selectedTime ? 'success' : booked ? 'error' : 'primary'}
                                                onClick={() => setSelectedTime(time)}
                                                disabled={booked}
                                                fullWidth
                                            >
                                                {time}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography color="textSecondary">No available Timeslots</Typography>
                            )
                        ) : (
                            <Typography color="textSecondary">Please select a date, timezone, and duration to view available times.</Typography>
                        )}
                    </div>

                    {/* Confirm Booking Button */}
                    {selectedTime && (
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 4,
                                backgroundColor: 'green',
                                color: 'white', // Ensure the text is white for contrast
                                '&:hover': {
                                    backgroundColor: 'darkgreen', // Darker shade on hover
                                },
                            }}
                            onClick={() => bookSession(sessionId)}
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? <CircularProgress size={24} /> : `Confirm Booking for ${selectedTime}`}
                        </Button>
                    )}

                    {/* Booking Message */}
                    {bookingMessage && (
    <Typography color="error" sx={{ mt: 3 }}>
        {bookingMessage}
    </Typography>
)}
                </CardContent>
            </Card>

            
        </Container>
    );
};

export default Scheduler;