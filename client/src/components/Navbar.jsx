import React, { useContext, useEffect, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import Notifications from './Notifications'
import axios from 'axios'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent)

  const [showNotifications, setShowNotifications] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [requests, setRequests] = useState([])

  const notificationsRef = useRef(null)
  const favoritesRef = useRef(null)
  const profileRef = useRef(null)

  const fetchRequests = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.get(
        backendUrl + '/api/request/my-requests'
      )
      if (data.success) setRequests(data.requests)
    } catch {
      console.error('Error fetching notifications')
    }
  }

  useEffect(() => {
    if (userData) fetchRequests()
  }, [userData])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !notificationsRef.current?.contains(e.target) &&
        !favoritesRef.current?.contains(e.target) &&
        !profileRef.current?.contains(e.target)
      ) {
        setShowNotifications(false)
        setShowFavorites(false)
        setShowProfile(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(
        backendUrl + '/api/auth/send-verify-otp'
      )
      if (data.success) {
        navigate('/email-verify')
        toast.success(data.message)
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(
        backendUrl + '/api/auth/logout'
      )
      if (data.success) {
        setIsLoggedin(false)
        setUserData(false)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="w-full flex justify-between items-center py-2 px-4 sm:px-24 fixed top-0 z-50 bg-white shadow-md">
      <img
        src={assets.logo}
        alt="Home Harmony"
        className="w-44 sm:w-52 cursor-pointer"
        onClick={() => navigate('/')}
      />

      {userData ? (
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('/my-room')}
            className="text-base font-semibold text-gray-700 hover:text-indigo-600"
          >
            My Room
          </button>

          <button
            onClick={() => navigate('/my-posts')}
            className="text-base font-semibold text-gray-700 hover:text-indigo-600"
          >
            My Posts
          </button>

          <div ref={favoritesRef} className="relative">
            <button
              onClick={() => {
                setShowFavorites((p) => !p)
                setShowNotifications(false)
                setShowProfile(false)
              }}
              className="text-base font-semibold text-gray-700 hover:text-indigo-600 flex items-center gap-1"
            >
              My Favorites
              <svg
                className={`w-4 h-4 transition-transform ${
                  showFavorites ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showFavorites && (
              <div className="absolute mt-3 w-52 bg-white rounded-lg shadow-lg border border-gray-100 z-50 text-sm">
                <div
                  onClick={() => {
                    navigate('/favorite-rooms')
                    setShowFavorites(false)
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                >
                  Favorite Rooms
                </div>
                <div
                  onClick={() => {
                    navigate('/favorite-roommates')
                    setShowFavorites(false)
                  }}
                  className="px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer"
                >
                  Favorite Roommates
                </div>
              </div>
            )}
          </div>

          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => {
                setShowNotifications((p) => !p)
                setShowFavorites(false)
                setShowProfile(false)
              }}
              className="relative"
            >
              <svg
                className="w-7 h-7 text-gray-600 hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {requests.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <Notifications
                requests={requests}
                fetchRequests={fetchRequests}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => {
                setShowProfile((p) => !p)
                setShowFavorites(false)
                setShowNotifications(false)
              }}
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center overflow-hidden"
            >
              {userData.image ? (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                userData.name[0].toUpperCase()
              )}
            </button>

            {showProfile && (
              <ul className="absolute right-0 mt-3 bg-indigo-500 text-white rounded-lg shadow-lg min-w-[180px] text-sm z-50">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="px-4 py-2 hover:bg-indigo-400 cursor-pointer rounded-t-lg"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => navigate('/my-profile')}
                  className="px-4 py-2 hover:bg-indigo-400 cursor-pointer"
                >
                  My Profile
                </li>
                <li
                  onClick={logout}
                  className="px-4 py-2 hover:bg-indigo-400 cursor-pointer rounded-b-lg"
                >
                  Logout
                </li>
              </ul>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-gray-700 border border-gray-500 rounded-full px-6 py-2 hover:bg-gray-100 transition"
        >
          Login
          <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  )
}

export default Navbar
