import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import './SignUpForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// eslint-disable-next-line no-unused-vars
import {  faFacebook } from '@fortawesome/free-brands-svg-icons';

const GOOGLE_CLIENT_ID = "470502848789-170sfgi6ep7qp18u49ohmot14nr6ifbu.apps.googleusercontent.com";
const FACEBOOK_APP_ID = "1861800831008526";

const SignUp = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [otp, setOtp] = useState(''); // For OTP input
    const [csrfToken, setCsrfToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpSent, setOtpSent] = useState(false); // To track if OTP has been sent

    const { username, email, password } = formData;
    const navigate = useNavigate();

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await fetch('/api/csrf-token');
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF Token:', error);
            }
        };
        getCsrfToken();
    }, []);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onOtpChange = (e) => setOtp(e.target.value); // Handle OTP input

    // Function to handle OTP submission and verification
    const onVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOtpError('');
        try {
            const res = await fetch('http://localhost:8080/api/user/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({email, username, password, otp }),
            });

          
            if (!res.ok) {
                throw new Error('Invalid or expired OTP');
            }

            // Redirect to login or dashboard after successful OTP verification
            navigate('/login');
        } catch (error) {
            setOtpError('Invalid or expired OTP. Please try again.');
            console.error('OTP verification failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');
        try {
            // Request OTP via backend API
            const res = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ username, email, password }),
            });
            const responseText = await res.text(); // Get response text

            if (!res.ok) {
                if (responseText === 'Email already exists') {
                    setErrorMessage('Email already exists');
                } else if (responseText === 'Username already exists') {
                    setErrorMessage('Username already exists');
                } else {
                    setErrorMessage('Error during signup. Please try again.');
                }
                return;
            }
            if (!res.ok) {
                throw new Error('Error sending OTP');
            }

            setOtpSent(true); // Track that OTP has been sent
        } catch (error) {
            console.error('Signup failed:', error);
            setErrorMessage('Error during signup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (response) => {
        const googleToken = response.credential;
        setLoading(true);
        setErrorMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({ token: googleToken }),
            });

            if (!res.ok) {
                throw new Error('Google sign-up failed');
            }

            const data = await res.json();
            console.log('data',data);
            window.location.href = 'http://localhost:3131';
        } catch (error) {
            console.error('Google sign-up failed:', error);
            setErrorMessage('Google sign-up failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google Sign-In Failed:', error);
        setErrorMessage('Google sign-up failed. Please try again.');
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="signup-form-container">
                <h2>Create an account</h2>
                {!otpSent && (
                    <form onSubmit={onSubmit}>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={onChange}
                            placeholder="Username"
                            required
                            className="email-input"
                        />
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
                        <button type="submit" className="continue-button" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Sign Up'}
                        </button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                )}

                {/* OTP Input field visible only after OTP has been sent */}
                {otpSent && (
                    <form onSubmit={onVerifyOtp}>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={onOtpChange}
                            placeholder="Enter OTP"
                            required
                            className="otp-input"
                        />
                        <button type="submit" className="continue-button" disabled={loading}>
                            {loading ? 'Verifying OTP...' : 'Verify OTP'}
                        </button>
                        {otpError && <p className="error-message">{otpError}</p>}
                    </form>
                )}

                <div className="or-divider">
                    <span>OR</span>
                </div>
                <div className="social-buttons">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleFailure}
                        className="google-button"  // Apply the custom class
                        text="signin_with"
                    />
                    <FacebookLogin
                        appId={FACEBOOK_APP_ID}
                        callback={handleGoogleSuccess}
                        render={renderProps => (
                            <button onClick={renderProps.onClick} className="facebook-button">
                                <FontAwesomeIcon icon={faFacebook} className="icon" /> Continue with Facebook
                            </button>
                        )}
                    />
                </div>
            </div>
        </GoogleOAuthProvider>
    );
};

export default SignUp;