// src/services/apiService.js
import axios from 'axios';

// Function to get the CSRF token
export const getCsrfToken = async () => {
    try {
        const response = await axios.get('http://localhost:8080/csrf-token');
        return response.data.csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

// Function to send a POST request with the CSRF token
export const sendRequest = async (endpoint, data) => {
    try {
        const csrfToken = await getCsrfToken();
        return await axios.post(`http://localhost:8080/${endpoint}`, data, {
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        });
    } catch (error) {
        console.error('Error sending request:', error);
        throw error;
    }
};