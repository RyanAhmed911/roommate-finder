import React, { useContext, useEffect} from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from './context/AppContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import CreateProfile from './pages/CreateProfile.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedin, userData } = useContext(AppContent);

  useEffect(() => {
    if (isLoggedin && userData) {
      if (!userData.isProfileCompleted && location.pathname !== '/create-profile') {
        navigate('/create-profile');
      }

      if (userData.isProfileCompleted && location.pathname === '/create-profile') {
        navigate('/');
      }
    }
  }, [isLoggedin, userData, location.pathname, navigate]);

  return (
    <div> 
       <ToastContainer/>  {/*added by Nusayba*/}
      <Routes>
        <Route path='/' element={<Home />} /> {/*added by Ryan*/}
        <Route path='/login' element={<Login />} /> {/*added by Ryan*/}
        <Route path='/email-verify' element={<EmailVerify />} /> {/*added by Ryan*/}
        <Route path='/reset-password' element={<ResetPassword />} /> {/*added by Ryan*/}
        <Route path='/create-profile' element={<CreateProfile />}/> {/*added by Ryan*/}
      </Routes>
    </div>
  )
}

export default App