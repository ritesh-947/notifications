import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginForm.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    // Configure axios instance
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api',
        withCredentials: true, // To include cookies for refresh token
    });

    // Add axios interceptor for token refresh logic
    useEffect(() => {
        const setupInterceptors = () => {
            axiosInstance.interceptors.response.use(
                (response) => response, // Pass through successful responses
                async (error) => {
                    const originalRequest = error.config;

                    // Check if the error is due to an expired access token
                    if (error.response && error.response.status === 401 && !originalRequest._retry) {
                        originalRequest._retry = true; // Prevent infinite retry loops

                        try {
                            // Refresh the token
                            const refreshResponse = await axiosInstance.post('/user/refresh-token');
                            const newAccessToken = refreshResponse.data.accessToken;

                            // Attach new access token to the original request
                            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                            // Retry the failed request with the new token
                            return axiosInstance(originalRequest);
                        } catch (refreshError) {
                            console.error('Token refresh failed:', refreshError);
                            // Redirect to login page if refresh fails
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    }

                    return Promise.reject(error); // Propagate other errors
                }
            );
        };

        setupInterceptors();
    }, [axiosInstance]);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log({ email, password });

        try {
            // Perform login and get tokens
            const response = await axiosInstance.post('/user/login', { email, password });
            const { accessToken } = response.data;

            // Store access token in Authorization header
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Redirect to the external homepage after successful login
            window.location.href = 'https://homefront12.netlify.app'; // Replace with your homepage URL
        } catch (error) {
            console.error('Login error:', error);
            // Handle login error (e.g., display error message)
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
            <div className="or-divider">
                <span>OR</span>
            </div>
            <div className="social-buttons">
                <button className="google-button">Continue with Google</button>
                <button className="facebook-button">Continue with Facebook</button>
            </div>
        </div>
    );
};

export default Login;