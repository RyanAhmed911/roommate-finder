import React, { useContext, useEffect} from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppContent } from './context/AppContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import EmailVerify from './pages/EmailVerify.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import CreateProfile from './pages/CreateProfile.jsx';
import MyProfile from './pages/MyProfile.jsx';
import Rooms from './pages/Rooms.jsx';
import PostRoom from './pages/PostRoom.jsx';
import Roommates from './pages/Roommates.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyPosts from './pages/MyPosts.jsx'
//Changed by Ryan
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedin, userData } = useContext(AppContent);

  useEffect(() => {
    if (isLoggedin && userData) {

      if (!userData.isAccountVerified) {
        if (location.pathname !== '/email-verify') {
          navigate('/email-verify');
        }
        return; 
      }

      if (!userData.isProfileCompleted) {
        if (location.pathname !== '/create-profile') {
          navigate('/create-profile');
        }
      }
    }
  }, [isLoggedin, userData, navigate, location.pathname]);
//Changed by Ryan



  return (
    <div> 
       <ToastContainer/>  {/*added by Nusayba*/}
      <Routes>
        <Route path='/' element={<Home />} /> {/*added by Ryan*/}
        <Route path='/login' element={<Login />} /> {/*added by Ryan*/}
        <Route path='/email-verify' element={<EmailVerify />} /> {/*added by Ryan*/}
        <Route path='/reset-password' element={<ResetPassword />} /> {/*added by Ryan*/}
        <Route path='/create-profile' element={<CreateProfile />}/> {/*added by Ryan*/}
        <Route path='/my-profile' element={<MyProfile />}/> {/*added by Ryan*/}
        <Route path='/rooms' element={<Rooms />} /> 
        <Route path='/post-room' element={<PostRoom />} /> 
        <Route path='/roommates' element={<Roommates />} />
        <Route path="/my-posts" element={<MyPosts />} />
      </Routes>
    </div>
  )
}

export default App