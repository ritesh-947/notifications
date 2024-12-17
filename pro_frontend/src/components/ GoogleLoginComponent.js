import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Replace with your Google Client ID
const GOOGLE_CLIENT_ID = "470502848789-170sfgi6ep7qp18u49ohmot14nr6ifbu.apps.googleusercontent.com";

const GoogleLoginComponent = () => {
  // Handle success response
  const handleGoogleSuccess = (response) => {
    const googleToken = response.credential;
    console.log('Google Sign-In Success, Token:', googleToken);
    // You can send the googleToken to your backend for further processing
    // Example: fetch('/api/auth/google', { method: 'POST', body: JSON.stringify({ token: googleToken }) })
  };

  // Handle failure response
  const handleGoogleFailure = (error) => {
    console.error('Google Sign-In Failed:', error);
    // Optionally, display error message to the user
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <h2>Login with Google</h2>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleFailure}
          text="signin_with"  // Optional: customize the button text
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;