import React, { useContext } from 'react'
import { assets } from '../assets/assets'   
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {

  {/*added by Nusayba*/}
  const navigate = useNavigate();
  const {userData, backendUrl, setUserData, setIsLoggedin} = useContext(AppContent)
  
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
  
  {/*added by Ryan*/}
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.logo} alt="Home Harmony Logo" className="w-40 sm:w-48"/>
      {userData ?
      <div className = 'relative group cursor-pointer'>
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white overflow-hidden'>
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
            <li onClick={logout} className='py-1 px-2 hover:bg-indigo-400 cursor-pointer pr-10'>Logout</li>
          </ul>
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