import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login-lite';
import './SignUpForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;
const API_BASE_URL = 'https://login-backend-server-vto2.onrender.com'; // Update with your backend URL
// const API_BASE_URL = 'http://localhost:8080'; // Update with your backend URL

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const { username, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onOtpChange = (e) => setOtp(e.target.value);

  // Submit signup form to register user
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        if (responseText === 'Email already exists') {
          setErrorMessage('Email already exists');
        } else if (responseText === 'Username already exists') {
          setErrorMessage('Username already exists');
        } else {
          setErrorMessage('Error during signup. Please try again.');
        }
        return;
      }

      setOtpSent(true); // Proceed to OTP verification
    } catch (error) {
      console.error('Signup failed:', error);
      setErrorMessage('Error during signup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP to complete signup
  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOtpError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password, otp }),
      });

      if (!response.ok) {
        throw new Error('Invalid or expired OTP');
      }

      const { sessionId } = await response.json();
      localStorage.setItem('sessionId', sessionId); // Save session ID to localStorage
      navigate('/homepage'); // Redirect to homepage
    } catch (error) {
      console.error('OTP verification failed:', error);
      setOtpError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//   // Google login success handler
//   const handleGoogleSuccess = async (response) => {
//     const googleToken = response.credential;
//     setLoading(true);
//     setErrorMessage('');
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ token: googleToken }),
//       });

//       if (!res.ok) {
//         throw new Error('Google sign-up failed');
//       }

//       const { sessionId } = await res.json();
//       localStorage.setItem('sessionId', sessionId); // Save session ID
//       navigate('/homepage'); // Redirect to homepage
//     } catch (error) {
//       console.error('Google sign-up failed:', error);
//       setErrorMessage('Google sign-up failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

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
            <p className="already-member">
              Already have an account?{' '}
              <a href="/login" style={{ color: 'blue',textDecoration: 'none' }}>
                Login
              </a>
              <p className="terms-and-conditions">
    By logging in or signing up, you agree to our 
    <a href="/terms-and-conditions" style={{ color: 'blue', textDecoration: 'none' }}>
        Terms and Conditions
    </a>.
</p>
            </p>
          </form>
        )}
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
          {/* <span>OR</span> */}
        </div>
        {/* <div className="social-buttons">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            className="google-button"
            text="signin_with"
          />
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            callback={handleGoogleSuccess}
            render={(renderProps) => (
              <button onClick={renderProps.onClick} className="facebook-button">
                <FontAwesomeIcon icon={faFacebook} className="icon" /> Continue with Facebook
              </button>
            )}
          />
        </div> */}
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;