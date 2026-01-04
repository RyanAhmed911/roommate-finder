import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'   
import { useNavigate, useLocation } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import Notifications from './Notifications';
import axios from 'axios';

const Navbar = () => {

  {/*added by Nusayba*/}
  const navigate = useNavigate();
  const location = useLocation();
  const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)
  const [showNotifications, setShowNotifications] = useState(false)
  const [requests, setRequests] = useState([])

  const fetchRequests = async () => {
      try {
          axios.defaults.withCredentials = true
          const { data } = await axios.get(backendUrl + '/api/request/my-requests')
          if (data.success) {
              setRequests(data.requests)
          }
      } catch (error) {
          console.error("Error fetching notifications")
      }
  }
  
  useEffect(() => {
    if (userData) {
      fetchRequests();
    }
  }, [userData])

  const sendVerificationOtp = async ()=>{
    try {
      axios.defaults.withCredentials = true;

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if(data.success){
        navigate('/email-verify')
        toast.success(data.message)
      }else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }
  const logout = async ()=>{
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/auth/logout')
      data.success && setIsLoggedin(false)
      data.success && setUserData(false)
      navigate('/')

    } catch (error) {
      toast.error(error.message)
    }
  }
  {/*added by Nusayba*/}
  
  {/*added by Ryan, Modified by Nusayba*/}
  return (
    <div className="w-full flex justify-between items-center py-2 px-4 sm:px-24 absolute top-0 z-50 bg-white shadow-md">
      <img onClick={() => navigate('/')} src={assets.logo} alt="Home Harmony Logo" className="w-40 sm:w-48 cursor-pointer"/>
      
      {userData ?
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
            <svg className="w-7 h-7 text-gray-600 hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {requests.length}
                </span>
            )}
        </div>

        {/* Notification Dropdown */}
        {showNotifications && (
            <Notifications 
                requests={requests} 
                fetchRequests={fetchRequests} 
                onClose={() => setShowNotifications(false)} 
            />
        )}
        <span className="font-medium text-gray-800 hidden sm:block text-lg sm:text-xl">Hi, {userData.name}</span>
        <div className = 'relative group cursor-pointer'>
            <div className='w-9 h-9 flex justify-center items-center rounded-full bg-black text-white overflow-hidden border border-gray-300'>
                {userData.image ? (
                    <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    userData.name[0].toUpperCase()
                )}
            </div>
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-white rounded pt-10'>
            <ul className ='list-none m-0 p-2 bg-indigo-500 text-sm'>
                {!userData.isAccountVerified &&
                <li onClick= {sendVerificationOtp} className='py-1 px-2 hover:bg-indigo-200 cursor-pointer'>Verify Email</li>}
                <li onClick={() => navigate('/my-profile')} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer'>My Profile</li>
                <li onClick={() => navigate('/my-room')} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer'>My Room</li>
                <li onClick={() => navigate('/my-posts')} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer'>My Posts</li>
                {/* Added by Prachurzo */}
                <li onClick={() => navigate('/favorite-rooms')} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer'>Favorite Rooms</li> 
                <li onClick={() => navigate('/favorite-roommates')} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer'>Favorite Roommates</li>
                
                <li onClick={logout} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer pr-10'>Logout</li>
            </ul>
            </div>
        </div>
      </div>
      : <button 
          onClick={() => navigate('/login')} 
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
          Login 
          <img src={assets.arrow_icon} alt="" />
        </button>
    }
    </div>
  )
}

export default Navbar
