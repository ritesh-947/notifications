import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BecomeCreatorPage.css';

// Function to check user's role
const checkUserRole = async () => {
    const token = localStorage.getItem('sessionId'); // Retrieve session ID from localStorage
    if (!token) return null; // Return null if no session ID found

    try {
        const response = await axios.get('http://localhost:3122/api/user-role', {
            headers: { Authorization: `Bearer ${token}` }, // Pass token in Authorization header
            withCredentials: true, // Ensure cookies are sent
        });
        return response.data.role; // Return user's role
    } catch (error) {
        console.error('Error fetching user role:', error);
        return null; // Return null on error
    }
};

// Function to make user a creator
const becomeCreator = async () => {
    const token = localStorage.getItem('sessionId'); // Retrieve the token from localStorage
    if (!token) throw new Error('No session ID found');
    console.log('Session ID:', token);

    return axios.post('http://localhost:3122/api/become-creator', {}, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true, // Ensure cookies are sent
    });
};

const CreatorButton = ({ onClick }) => {
    return (
        <button onClick={onClick} className="creator-button">
            Become a Creator
        </button>
    );
};

const BecomeCreatorPage = () => {
    const navigate = useNavigate();

    // Redirect user if their role is already creator
    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            const role = await checkUserRole(); // Fetch user's role
            if (role === 'creator') {
                console.log('User is already a creator, redirecting to /upload...');
                navigate('/upload'); // Redirect to /upload
            }
        };
        checkRoleAndRedirect();
    }, [navigate]);

    const handleBecomeCreator = async () => {
        try {
            await becomeCreator();
            console.log('User became a creator. Redirecting to /upload...');
            navigate('/upload'); // Redirect to the session creation page
        } catch (error) {
            console.error('Error becoming a creator:', error);
            alert('There was an issue becoming a creator. Please try again.');
        }
    };

    return (
        <div className="become-creator">
            <h1>Become a Creator</h1>
            <p>Share your knowledge and expertise with others by becoming a creator!</p>
            <CreatorButton onClick={handleBecomeCreator} />
        </div>
    );
};

export default BecomeCreatorPage;