// import React from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// function App() {
//     return (
//         <GoogleOAuthProvider clientId="419695031669-q5q9tm6q92g70ddao0uf5d5j0n49ivgc.apps.googleusercontent.com">
//             <GoogleLogin
//                 onSuccess={(credentialResponse) => {
//                     console.log(credentialResponse);
//                 }}
//                 onError={() => {
//                     console.log("Login Failed");
//                 }}
//             />
//         </GoogleOAuthProvider>
//     );
// }

// export default App;


//auth2/authpage/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Alert from './components/Alert'; //
import ResetPasswordForm from './components/ResetPasswordForm';


function App() {
  return (
    <Router>
      <div className="App">
        <Alert />
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPasswordForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;