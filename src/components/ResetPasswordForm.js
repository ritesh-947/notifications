import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResetPasswordForm.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'; // Success icon

const ResetPasswordOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8080/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF Token:', error);
      }
    };
    getCsrfToken();
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      await axios.post('https://login-backend-server-vto2.onrender.com/api/user/request-reset-otp', { email }, {
      // await axios.post('http://localhost:8080/api/user/request-reset-otp', { email }, {
        headers: { 'CSRF-Token': csrfToken },
      });
      setIsOtpSent(true);
      setSuccessMessage('OTP has been sent to your email.');
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests! Please try again later.');
      } else if (err.response?.status === 404) {
        setError('Email not found. Please try again.');
      } else {
        setError('Error sending OTP. Please try again.');
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const res = await axios.post('https://login-backend-server-vto2.onrender.com/api/user/verify-reset-otp', { email, otp }, {
      // const res = await axios.post('http://localhost:8080/api/user/verify-reset-otp', { email, otp }, {
      headers: { 'CSRF-Token': csrfToken },
      });
      if (res.status === 200) {
        setIsOtpVerified(true);
        setSuccessMessage('OTP verified successfully. Please set a new password.');
      }
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
      } else {
        setError('Error verifying OTP. Please try again.');
      }
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setSuccessMessage('');
    try {
      await axios.post('https://login-backend-server-vto2.onrender.com/api/user/reset-password', { email, otp, newPassword }, {
      // await axios.post('http://localhost:8080/api/user/reset-password', { email, otp, newPassword }, {
        headers: { 'CSRF-Token': csrfToken },
      });
      setSuccessMessage('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError('Error updating password. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset your password</h2>

      {/* Display success message with green icon */}
      {successMessage && (
        <div className="success-message-container">
          <FontAwesomeIcon icon={faCheckCircle} className="success-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Email input form */}
      {!isOtpSent && (
        <form onSubmit={handleRequestOtp}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Request OTP</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      {/* OTP verification form */}
      {isOtpSent && !isOtpVerified && (
        <form onSubmit={handleVerifyOtp}>
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button type="submit">Verify OTP</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}

      {/* New password form */}
      {isOtpVerified && (
        <form onSubmit={handleUpdatePassword}>
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetPasswordOTP;