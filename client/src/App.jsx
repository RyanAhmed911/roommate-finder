import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div> 
       <ToastContainer/>  {/*added by Nusayba*/}
      <Routes>
        <Route path='/' element={<Home />} /> {/*added by Ryan*/}
        <Route path='/login' element={<Login />} /> {/*added by Ryan*/}
        <Route path='/email-verify' element={<EmailVerify />} /> {/*added by Ryan*/}
        <Route path='reset-password' element={<ResetPassword />} /> {/*added by Ryan*/}
      </Routes>
    </div>
  )
}

export default App