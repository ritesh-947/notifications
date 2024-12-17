import React from 'react';
import './CheckEmailMessage.css';

const CheckEmailMessage = ({ email }) => {
  return (
    <div className="check-email-container">
      <div className="icon-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="48"
          viewBox="0 96 960 960"
          width="48"
        >
          <path d="M120 276v420 60 60-60-60V276Zm720 480V276 216h60-60v60 480Zm-60 0H180q-12 0-21-9t-9-21v-60V276q0-12 9-21t21-9h600q12 0 21 9t9 21v420q0 12-9 21t-21 9Zm-180-80q5 0 8.5-3.5t3.5-8.5q0-5-3.5-8.5T600 656H360q-5 0-8.5 3.5T348 668q0 5 3.5 8.5T360 680h240Zm0-100q5 0 8.5-3.5t3.5-8.5q0-5-3.5-8.5T600 556H360q-5 0-8.5 3.5T348 568q0 5 3.5 8.5T360 580h240ZM480 516q10 0 17-7t7-17q0-10-7-17t-17-7q-10 0-17 7t-7 17q0 10 7 17t17 7Z" />
        </svg>
      </div>
      <h2>Check Your Email</h2>
      <p>
        Please check the email address {email} for instructions to reset your password.
      </p>
      <button>Resend email</button>
    </div>
  );
};

export default CheckEmailMessage;