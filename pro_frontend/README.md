# JWT Token Handling in a Node.js Application

## Overview

This document provides instructions on setting up a Node.js backend and a React frontend for handling JWT tokens. The JWT token is sent as an HTTP-only cookie after user authentication and can be accessed across different ports.

## Backend (Server Setup)

1. **Setup `cookie-parser` and CORS:**

   The `login`In your `server.js`, ensure you’ve already set up `cookie-parser` and configured CORS to allow credentials from specific origins. This configuration allows cookies to be sent with requests to and from your server.

2. **Login Route:**

   route in your `user.js` file generates a JWT token and sets it as an HTTP-only cookie. Here’s the relevant code snippet:

   ```javascript
   const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

   // Set the token in a cookie
   res.cookie("token", token, {
     httpOnly: true, // Prevent JavaScript access
     secure: false, // Set to true if using HTTPS
     maxAge: 3600000, // 1 hour
   });
   ```

---

Your login.js file is well-structured, handling user registration, login, and authentication using JWTs stored in cookies. Below is an overview of your setup, followed by a few suggestions to improve security and handling.

Overview:

    1.	User Registration:
    •	Users can register with a username, email, and password.
    •	Passwords are hashed using bcryptjs before being stored in the database.
    •	After registration, a JWT is generated and stored in an HTTP-only cookie.
    •	The user’s profile is initialized with a default template in the user_profile table.
    2.	User Login:
    •	Users can log in with their email and password.
    •	If the credentials are valid, a JWT is generated and stored in an HTTP-only cookie.
    •	The user’s profile information (username and full name) is retrieved and sent back in the response.
    3.	Authentication Middleware:
    •	The auth middleware verifies the presence and validity of the JWT stored in the cookie before allowing access to protected routes.

Suggestions for Improvement:

    1.	Environment Variables:
    •	Ensure that process.env.JWT_SECRET is set in your environment. In a real-world application, the JWT secret should never be hardcoded. Use environment variables and ensure they are managed securely.
    2.	Cookie Security:
    •	In production, set secure: true in the cookie options to ensure the cookie is only sent over HTTPS.
    •	Consider adding the sameSite: 'strict' or sameSite: 'lax' attribute to the cookie to mitigate CSRF attacks:

---

• You may want to enforce uniqueness on session_title within the same creator_id to avoid duplicate sessions by the same user.

    6.	Reminders Table:
    •	The reminder table looks good. However, consider adding an index on attendee_id and session_id for faster lookup.

    •	Consider adding created_at and updated_at timestamps to all tables for better tracking and auditing.

• Indexing the most queried fields (e.g., email, username, session_id) will improve performance.

---

To receive and send cookies between your client (frontend) and server (backend), you need to ensure that the cookies are properly set in the server's HTTP response and that the client is configured to include them in subsequent requests. Here's how you can achieve this:

### 1. Setting the Cookie in the Server Response

You've already configured your backend to set the cookie using `res.cookie`. Make sure that when you set the cookie, it is properly configured for cross-origin requests if your frontend and backend are on different origins.

Example:

```javascript
res.cookie("token", token, {
  httpOnly: true, // Prevent access from JavaScript
  secure: false, // Set to true if you're using HTTPS
  sameSite: "Lax", // Controls cookie sending in cross-origin requests
  maxAge: 3600000, // 1 hour
});
```

### 2. Configure the Frontend to Include Cookies in Requests

When making requests from your frontend, ensure that the `credentials` option is set to `true`. This tells the browser to include cookies in the request, even if the request is cross-origin.

For example, when using `fetch`:

```javascript
fetch("http://localhost:7079/api/endpoint", {
  method: "POST",
  credentials: "include", // Include cookies in the request
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

Or, if you're using Axios:

```javascript
axios
  .post("http://localhost:7079/api/endpoint", data, {
    withCredentials: true, // Include cookies in the request
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### 3. CORS Configuration

Your backend already has CORS configured, but ensure it allows credentials:

```javascript
const corsOptions = {
  origin: "http://localhost:7080", // Allow requests from your frontend
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true, // Allow cookies to be sent and received
};
app.use(cors(corsOptions));
```

### 4. Accessing the Cookie in Subsequent Requests

Once the cookie is set, it will be included in subsequent requests to your backend. On the server side, you can access the cookie using `req.cookies` (provided by the `cookie-parser` middleware):

```javascript
const token = req.cookies.token;
if (!token) {
  return res.status(401).json({ error: "No token provided" });
}

try {
  const decoded = jwt.verify(token, jwtSecret);
  req.user = decoded;
  next();
} catch (err) {
  res.status(400).json({ error: "Invalid token" });
}
```

### 5. Testing

- Set up your frontend to make a request to the backend after logging in or registering a user.
- Check your browser’s developer tools under the "Network" tab to see if the cookie is included in subsequent requests to your server.
- Also, check the "Application" tab in developer tools to see if the cookie is stored.

By following these steps, your frontend should correctly receive and send the cookie, allowing for session management and authentication in your web application.

---

: Host the Privacy Policy on Your Own Website

If you prefer, you can download the HTML code provided by FreePrivacyPolicy and host it on your own website.

    1.	Download the HTML Code:
    •	Use the option provided by FreePrivacyPolicy to download the HTML code of your Privacy Policy.
    2.	Create a New Web Page:
    •	On your website, create a new page dedicated to your Privacy Policy (e.g., https://www.yourwebsite.com/privacy-policy).
    3.	Paste the HTML Code:
    •	Open the new page in your website editor, and paste the HTML code into the page’s content section.
    4.	Publish the Page:
    •	Once you’ve pasted the code, publish the page to make it live and accessible to the public.
    5.	Copy the URL:
    •	After publishing, visit the page and copy its URL (e.g., https://www.yourwebsite.com/privacy-policy).
    6.	Update Facebook App Settings:
    •	Go back to the App Settings in the Facebook Developer Console, and replace the Privacy Policy URL with the URL of your newly created page.
    7.	Save Changes:
    •	Don’t forget to save the changes after updating the URL.
