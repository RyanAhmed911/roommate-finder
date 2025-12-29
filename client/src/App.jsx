import React, { useContext, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AppContent } from './context/AppContext.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import EmailVerify from './pages/EmailVerify.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import CreateProfile from './pages/CreateProfile.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Rooms from './pages/Rooms.jsx'
import PostRoom from './pages/PostRoom.jsx'
import Roommates from './pages/Roommates.jsx'
import ViewProfile from './pages/ViewProfile.jsx'
import MyRoom from './pages/MyRoom.jsx'
import MyPosts from './pages/MyPosts.jsx'
import ExpensesPage from './pages/ExpensesPage.jsx'
import ChoresPage from './pages/ChoresPage.jsx'
import GroupChat from './pages/GroupChat.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedin, userData } = useContext(AppContent)

  useEffect(() => {
    if (isLoggedin && userData) {
      if (!userData.isAccountVerified) {
        if (location.pathname !== '/email-verify') {
          navigate('/email-verify')
        }
        return
      }

      if (!userData.isProfileCompleted) {
        if (location.pathname !== '/create-profile') {
          navigate('/create-profile')
        }
      }
    }
  }, [isLoggedin, userData, navigate, location.pathname])

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/create-profile' element={<CreateProfile />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/rooms' element={<Rooms />} />
        <Route path='/post-room' element={<PostRoom />} />
        <Route path='/roommates' element={<Roommates />} />
        <Route path='/my-posts' element={<MyPosts />} />
        <Route path='/view-profile/:id' element={<ViewProfile />} />
        <Route path='/my-room' element={<MyRoom />} />
        <Route path='/room/expenses' element={<ExpensesPage />} />
        <Route path='/room/chores' element={<ChoresPage />} />
        <Route path='/room/groupchat' element={<GroupChat />} />
      </Routes>
    </div>
  )
}

export default App