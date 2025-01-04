import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    FormHelperText,
    Select,
    MenuItem,
} from '@mui/material';
import axios from 'axios';
import countryCodes from './EditOptions/countryCodeOptions'; // Import country codes
import TimezoneSelector from './EditOptions/TimezoneSelector'; // Import the TimezoneSelector component
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [profileData, setProfileData] = useState({
        username: '',
        full_name: '',
        bio: '',
        language: ['', '', ''],
        interested_categories: [],
        gender: '',
        custom_gender: '',
        mobile_no: '',
        country_code: '+91',
        country_name: '',
        continent: '',
        timezone: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch `sessionId` from localStorage
    const sessionId = localStorage.getItem('sessionId');

    // Handle API Errors
    const handleApiError = (error) => {
        console.error('[ERROR] API error:', error.response?.data || error.message);
        if (error.response?.status === 401) {
            setError('Unauthorized access. Please log in again.');
        } else {
            setError('An error occurred. Please try again.');
        }
    };

    // Fetch Profile Data
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!sessionId) {
                setError('No session found. Please log in.');
                setIsLoading(false);
                return;
            }

            try {
                // const response = await axios.get('https://edit-prof-js.onrender.com/userprofile', {
                const response = await axios.get('http://localhost:8084/userprofile', {
                    headers: {
                        Authorization: `Session ${sessionId}`, // Pass sessionId in the Authorization header
                    },
                });
                console.log('[INFO] Profile data fetched:', response.data);

                setProfileData({
                    ...response.data,
                    language: response.data.language || ['', '', ''],
                    interested_categories: response.data.interested_categories || [],
                    country_code: response.data.country_code || '+91',
                    country_name: response.data.country_name || '',
                    continent: response.data.continent || '',
                    timezone: response.data.timezone || '',
                });
                setError(null);
            } catch (error) {
                handleApiError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, [sessionId]);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLanguageChange = (index, e) => {
        const { value } = e.target;
        setProfileData((prevData) => {
            const newLanguages = [...prevData.language];
            newLanguages[index] = value;
            return { ...prevData, language: newLanguages };
        });
    };

    const handleCategoryChange = (e) => {
        setProfileData((prevData) => ({
            ...prevData,
            interested_categories: e.target.value.slice(0, 3), // Limit to 3 categories
        }));
    };

    const handleGenderChange = (e) => {
        const { value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            gender: value,
            custom_gender: value === 'Custom' ? prevData.custom_gender : '',
        }));
    };

    const handleCountryCodeChange = (e) => {
        const selectedCountry = countryCodes.find((code) => code.value === e.target.value);
        setProfileData((prevData) => ({
            ...prevData,
            country_code: selectedCountry.value,
            country_name: selectedCountry.label,
            continent: selectedCountry.continent,
        }));
    };

    const handleTimezoneChange = (continent, country, timezone) => {
        setProfileData((prevData) => ({
            ...prevData,
            continent: continent,
            country_name: country,
            timezone: timezone,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (profileData.interested_categories.length > 3) {
            setError('Please select up to 3 categories.');
            return;
        }

        try {
            // await axios.post('https://edit-prof-js.onrender.com/updateprofile', profileData, {
            await axios.post('http://localhost:8084/updateprofile', profileData, {
                headers: {
                    Authorization: `Session ${sessionId}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('Profile updated successfully');
            navigate('/my-profile'); // Redirect to home
        } catch (error) {
            handleApiError(error);
        }
    };

    const applyForCreator = async () => {
        try {
            const response = await axios.post(
                // 'https://edit-prof-js.onrender.com/apply-creator',
                'http://localhost:8084/apply-creator',
                { role: 'creator' }, // Data to update the role
                {
                    headers: {
                        Authorization: `Session ${sessionId}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('Successfully applied to be a creator!');
            setProfileData((prevData) => ({
                ...prevData,
                role: 'creator',
            }));
        } catch (error) {
            handleApiError(error);
        }
    };

    if (isLoading) {
        return (
            <Typography
                sx={{
                    color: 'black', // Set the text color to black
                    textAlign: 'center', // Center the text horizontally
                    marginTop: '3rem', // Add 3rem space at the top
                }}
            >
                Loading...
            </Typography>
        );
    }

    if (error) {
        return (
            <Typography
                sx={{
                    color: 'black', // Change color to black
                    textAlign: 'center', // Center the text
                    marginTop: '3rem', // Add 3rem space at the top
                }}
            >
                {error}
            </Typography>
        );
    }

    return (
        <Grid container justifyContent="center" sx={{ p: 2 }}>
            <Grid item xs={12} sm={8} md={6}>
                <Box
                    sx={{
                        width: '100%',
                        mt: 2,
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 3,
                    }}
                >
                  
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Edit Profile
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={profileData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="full_name"
                            value={profileData.full_name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                      
                        <TextField
                            fullWidth
                            label="Bio"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <Typography sx={{ mt: 2 }}>Languages (Up to 3):</Typography>
                        {profileData.language.map((lang, index) => (
                            <TextField
                                key={index}
                                fullWidth
                                label={`Language ${index + 1}`}
                                value={lang || ''}
                                onChange={(e) => handleLanguageChange(index, e)}
                                margin="normal"
                            />
                        ))}
                         
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Interested Categories</InputLabel>
                            <Select
                                multiple
                                value={profileData.interested_categories}
                                onChange={handleCategoryChange}
                            >
<MenuItem value="Career Development and Job Solutions">
    💼 Career Development and Job Solutions
</MenuItem>
<MenuItem value="Book Discussions and Recommendations">
    📚 Book Discussions and Recommendations
</MenuItem>
<MenuItem value="Health and Wellness">
    💪 Health and Wellness
</MenuItem>
<MenuItem value="Technology and Innovation">
    💻 Technology and Innovation
</MenuItem>
<MenuItem value="Entrepreneurship and Business Growth">
    🚀 Entrepreneurship and Business Growth
</MenuItem>
<MenuItem value="Creative Arts and Hobbies">
    🎨 Creative Arts and Hobbies
</MenuItem>
<MenuItem value="Education and Skill Development">
    🎓 Education and Skill Development
</MenuItem>
<MenuItem value="Legal Advice and Rights">
    ⚖️ Legal Advice and Rights
</MenuItem>
<MenuItem value="Financial Literacy and Investments">
    💰 Financial Literacy and Investments
</MenuItem>
<MenuItem value="Travel and Cultural Exchange">
    ✈️ Travel and Cultural Exchange
</MenuItem>
                            </Select>
                            <FormHelperText>Select up to 3 categories</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Gender</InputLabel>
                            <Select value={profileData.gender} onChange={handleGenderChange}>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Custom">Custom</MenuItem>
                                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                            </Select>
                        </FormControl>
                        {profileData.gender === 'Custom' && (
                            <TextField
                                fullWidth
                                label="Custom Gender"
                                value={profileData.custom_gender}
                                onChange={handleChange}
                                margin="normal"
                            />
                        )}
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Country Code</InputLabel>
                            <Select
                                value={profileData.country_code}
                                onChange={handleCountryCodeChange}
                            >
                                {countryCodes.map((code) => (
                                    <MenuItem key={code.value} value={code.value}>
                                        {code.label} ({code.value})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Mobile Number"
                            name="mobile_no"
                            value={profileData.mobile_no}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TimezoneSelector
                            continent={profileData.continent}
                            country={profileData.country_name}
                            timezone={profileData.timezone}
                            onChange={handleTimezoneChange}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                            Save Changes
                        </Button>

                    </form>
                </Box>
            </Grid>
        </Grid>
    );
};

export default EditProfile;