
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ResetPasswordForm.css';
import { useNavigate } from 'react-router-dom';

const ResetPasswordOTP = () => {
  const [email, setEmail] = useState(''); // Email input
  const [otp, setOtp] = useState(''); // OTP input
  const [newPassword, setNewPassword] = useState(''); // New password input
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password input
  const [isOtpSent, setIsOtpSent] = useState(false); // Whether OTP has been sent
  const [isOtpVerified, setIsOtpVerified] = useState(false); // Whether OTP is verified
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Success message to show
  const [csrfToken, setCsrfToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8080/csrf-token');
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        setError('Error fetching CSRF Token. Please try again.');
        console.error('Error fetching CSRF Token:', error);
      }
    };
    getCsrfToken();
  }, []);

  // Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      await axios.post('http://localhost:8080/api/user/request-reset-otp', { email }, {
        headers: { 'CSRF-Token': csrfToken }
      });
      setIsOtpSent(true); // Proceed to OTP field
      setSuccessMessage('OTP has been sent to your email.');
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError('Too many requests! Please try again later.');
      } else if (err.response && err.response.status === 404) {
        setError('Email not found. Please try again.');
      } else {
        setError('Error sending OTP. Please try again.');
      }
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      const res = await axios.post('http://localhost:8080/api/user/verify-reset-otp', { email, otp }, {
        headers: { 'CSRF-Token': csrfToken }
      });
      if (res.status === 200) {
        setIsOtpVerified(true); // Proceed to password fields
        setSuccessMessage('OTP verified successfully. Please set a new password.');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Invalid or expired OTP. Please try again.');
      } else {
        setError('Error verifying OTP. Please try again.');
      }
    }
  };

  // Update Password after OTP is verified
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages
    try {
      await axios.post('http://localhost:8080/api/user/reset-password', { email, otp, newPassword }, {
        headers: { 'CSRF-Token': csrfToken }
      });
      setSuccessMessage('Password reset successfully! You can now log in with your new password.');
      navigate('/login'); // Redirect to login after success
    } catch (err) {
      setError('Error updating password. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset your password</h2>

      {/* Always show the email field initially */}
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
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>

      {/* Show the OTP field once the user has clicked "Request OTP" */}
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
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      )}

      {/* Show the new password fields if OTP is verified */}
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
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default ResetPasswordOTP;
