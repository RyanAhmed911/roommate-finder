import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

//added by Ryan
//modified by Nusayba
const Header = () => {

  const {userData} = useContext(AppContent)
  const navigate = useNavigate()
  
   return (
     <div className="flex flex-col w-full h-[calc(100vh-100px)] justify-center px-4 sm:px-10 max-w-[1400px] mx-auto mt-20 sm:mt-16">
       
       <div className="flex-1 flex flex-col items-center justify-center text-center animate-fadeIn pb-8">
         
         <div className="relative mb-4 hover:scale-105 transition-transform duration-500 ease-out">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-lg opacity-40 animate-pulse"></div>
              <img src={assets.header_img} alt="Header" className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white/10 object-cover shadow-2xl" />
         </div>
 
         <h1 className="text-4xl sm:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
           Welcome to <br className="hidden md:block" />
           <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
             Home Harmony
           </span>
         </h1>
         
         <p className="text-base sm:text-xl text-indigo-100/80 max-w-2xl font-light leading-relaxed">
            The modern way to find your perfect space.
            <span className="hidden sm:inline"> Verified profiles, smart matching, and simple connections.</span>
         </p>
       </div>
       <div className="w-full flex flex-col md:flex-row gap-6 mb-4 sm:mb-10">
         <button 
             onClick={() => navigate('/rooms')} 
             className="group flex-1 h-36 sm:h-48 relative overflow-hidden bg-gradient-to-br from-blue-600/0 via-indigo-600/00 to-pink-300 rounded-[2rem] shadow-2xl border border-white/20 hover:scale-[1.02] transition-all duration-300"
         >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
 
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                 <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                 
                 <span className="text-2xl sm:text-4xl font-bold text-white tracking-wide shadow-black/10 drop-shadow-lg">
                     Find Room
                 </span>
                 <span className="text-blue-100 font-medium uppercase tracking-widest text-xs sm:text-sm">Browse Listings</span>
              </div>
         </button>
         <button 
             onClick={() => navigate('/roommates')} 
              className="group flex-1 h-36 sm:h-48 relative overflow-hidden bg-gradient-to-br from-blue-600/0 via-indigo-600/00 to-blue-300 rounded-[2rem] shadow-2xl border border-white/20 hover:scale-[1.02] transition-all duration-300">

              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
 
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-2">
                 <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                 
                 <span className="text-2xl sm:text-4xl font-bold text-white tracking-wide shadow-black/10 drop-shadow-lg">
                     Find Roommate
                 </span>
                 <span className="text-purple-100 font-medium uppercase tracking-widest text-xs sm:text-sm">Connect with People</span>
              </div>
         </button>
 
       </div>
     
     </div>
   )
 }
//added by Ryan
//modified by Nusayba
export default Header