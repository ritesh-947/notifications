import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginForm.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Axios instance configuration
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api', // Update with your API URL
        // baseURL: 'https://login-backend-server-vto2.onrender.com/api', // Update with your API URL
        withCredentials: false, // No cookies used
    });

    // Attach session ID from localStorage to every request
    useEffect(() => {
        axiosInstance.interceptors.request.use(
            (config) => {
                const sessionId = localStorage.getItem('sessionId');
                if (sessionId) {
                    config.headers['Authorization'] = `Session ${sessionId}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }, []);

    // Check if the user is authenticated
    const isAuthenticated = () => {
        const sessionId = localStorage.getItem('sessionId');
        return !!sessionId;
    };

    // Redirect unauthenticated users
    useEffect(() => {
        if (!isAuthenticated()) {
            // window.location.href = '/login';
        }
    }, []);

    // Handle login
    const onSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axiosInstance.post('/login', { email, password });
            const { sessionId } = response.data;
    
            localStorage.setItem('sessionId', sessionId);
            window.location.href = '/homepage'; // Redirect on success
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };
    // Handle logout
    const logoutUser = async () => {
        try {
            const sessionId = localStorage.getItem('sessionId');
            await axiosInstance.post('/logout', { sessionId }); // Invalidate the session on the server
            localStorage.removeItem('sessionId'); // Remove session ID locally
            // window.location.href = '/login'; // Redirect to login
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="login-form-container">
            <h2>Welcome back</h2>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    placeholder="Email"
                    required
                    className="email-input"
                />
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    placeholder="Password"
                    required
                    className="email-input"
                />
                <button type="submit" className="continue-button">Log In</button>
            </form>
            <p>
                <a href="/resetpassword" style={{ color: 'blue' }}>Forget Password?</a>
            </p>
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
            {/* <div className="or-divider">
                <span>OR</span>
            </div> */}

            {/* <button onClick={logoutUser} className="logout-button">Logout</button> */}
        </div>
    );
};

export default Login;