import React, { useContext } from 'react'
import { AppContent } from '../context/AppContext'
import { assets } from '../assets/assets' 
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

//Implemented by Ryan
const MyProfile = () => {
    const { userData } = useContext(AppContent)
    const navigate = useNavigate()

    if (!userData) return <div className='text-white text-center mt-20'>Loading...</div>

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            
            <div className="pt-24 pb-10 px-4 flex justify-center">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-white relative">
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate('/')} 
                        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 border border-slate-700 rounded-full text-indigo-300 hover:text-white transition-all duration-300 backdrop-blur-sm z-10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Profile Header */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500">
                            {userData.image ? 
                                <img src={userData.image} alt="Profile" className="w-full h-full object-cover" /> :
                                <div className='w-full h-full bg-black flex items-center justify-center text-3xl'>
                                    {userData.name[0].toUpperCase()}
                                </div>
                            }
                        </div>
                        <h1 className="text-3xl font-bold">{userData.name}</h1>
                        <div className='flex gap-2 text-indigo-300 text-sm'>
                            <span>{userData.location || 'No Location'}</span>
                            {userData.nationality && <span>• {userData.nationality}</span>}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                        
                        {/* Basic Details */}
                        <div className="bg-[#333A5C] p-4 rounded-lg">
                            <span className="text-indigo-300 block mb-1 font-medium">Basic Info</span>
                            <p><span className="text-gray-400">Age:</span> {userData.age || 'N/A'}</p>
                            <p><span className="text-gray-400">Gender:</span> {userData.gender || 'N/A'}</p>
                            <p><span className="text-gray-400">Phone:</span> {userData.phone || 'N/A'}</p>
                        </div>

                        {/* Education/Work */}
                        <div className="bg-[#333A5C] p-4 rounded-lg">
                            <span className="text-indigo-300 block mb-1 font-medium">Institution/Occupation</span>
                            <p className="text-lg">{userData.institution || 'N/A'}</p>
                            {userData.status && <p className="text-gray-400 text-xs mt-1">Status: {userData.status}</p>}
                        </div>
                        {/* Languages */}
                        <div className="bg-[#333A5C] p-4 rounded-lg">
                            <span className="text-indigo-300 block mb-1 font-medium">Languages</span>
                            <p className="text-lg">
                                {Array.isArray(userData.languages) && userData.languages.length > 0 
                                    ? userData.languages.join(', ') 
                                    : 'N/A'}
                            </p>
                        </div>

                        {/* Personality & Hobbies */}
                        <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-1">
                            <span className="text-indigo-300 block mb-1 font-medium">About</span>
                            <p><span className="text-gray-400">Type:</span> {userData.personalityType || 'N/A'}</p>
                            <p className="mt-1">
                                <span className="text-gray-400">Hobbies:</span> {Array.isArray(userData.hobbies) ? userData.hobbies.join(', ') : 'N/A'}
                            </p>
                        </div>

                        {/* Lifestyle Habits */}
                        <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2">
                            <span className="text-indigo-300 block mb-3 font-medium">Lifestyle & Habits</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-gray-400 text-xs block">Food</span>
                                    <span>{userData.foodHabits || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block">Sleep</span>
                                    <span>{userData.sleepSchedule || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block">Cleanliness</span>
                                    <span>{userData.cleanlinessLevel || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block">Noise</span>
                                    <span>{userData.noiseTolerance || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                            {Array.isArray(userData.contactLinks) && userData.contactLinks.length > 0 && (
                            <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                                <span className="text-indigo-300 block mb-2 font-medium">Contact Links</span>
                                <div className="flex flex-col gap-1">
                                    {userData.contactLinks.map((link, index) => (
                                        <p key={index}>
                                            <span className="text-gray-400">{link.label}:</span> {link.url}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {/* Medical */}
                         {userData.medicalConditions && userData.medicalConditions.length > 0 && (
                            <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-3">
                                <span className="text-indigo-300 block mb-1 font-medium">Medical Conditions</span>
                                <span className="text-red-300">{Array.isArray(userData.medicalConditions) ? userData.medicalConditions.join(', ') : userData.medicalConditions}</span>
                            </div>
                        )}
                    </div>

                    <div className="my-6 border-b border-slate-700"></div>

                    {/* Preferences */}
                    <h3 className="text-indigo-300 mb-4 font-medium">Preferences & Dealbreakers</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        
                        {/* Smoker */}
                        <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                            <div className={`w-3 h-3 rounded-full ${userData.smoker ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span>{userData.smoker ? "Smoker" : "Non-Smoker"}</span>
                        </div>

                        {/* Drinker */}
                        <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                            <div className={`w-3 h-3 rounded-full ${userData.drinking ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            <span>{userData.drinking ? "Drinker" : "Non-Drinker"}</span>
                        </div>

                        {/* Visitors */}
                        <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                            <div className={`w-3 h-3 rounded-full ${userData.visitors ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>{userData.visitors ? "Visitors Allowed" : "No Visitors"}</span>
                        </div>

                        {/* Pets */}
                        <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                            <div className={`w-3 h-3 rounded-full ${userData.petsAllowed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span>{userData.petsAllowed ? "Pets Allowed" : "No Pets"}</span>
                        </div>

                    </div>

                    {/* Edit Button */}
                    <button 
                        onClick={() => navigate('/create-profile')} 
                        className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 mt-8 shadow-lg">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MyProfile
//Implemented by Ryan