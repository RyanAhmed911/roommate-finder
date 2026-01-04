import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Navbar from '../components/Navbar'

const ViewProfile = () => {
    const { id } = useParams() 
    const navigate = useNavigate()
    const { backendUrl, userData } = useContext(AppContent)
    
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchUserProfile = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + `/api/user/${id}`)
            if (data.success) {
                setProfileData(data.userData)
            } else {
                toast.error(data.message)
                navigate(-1) 
            }
        } catch (error) {
            toast.error("Error fetching profile")
        } finally {
            setLoading(false)
        }
    }

    const handleSendRequest = async () => {
        if (!userData) {
            toast.error("Please login to send a request")
            navigate('/login')
            return
        }

        try {
            axios.defaults.withCredentials = true
            
            const { data: roomData } = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (roomData.success) {
                if (roomData.rooms.length === 0) {
                    toast.info("You need to post a room before you can invite roommates.")
                    navigate('/post-room')
                } else {
                    const { data: inviteData } = await axios.post(backendUrl + '/api/request/send', { receiverId: id })
                    
                    if (inviteData.success) {
                        toast.success(inviteData.message)
                    } else {
                        toast.error(inviteData.message)
                    }
                }
            } else {
                toast.error(roomData.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [id])

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">Loading...</div>
    if (!profileData) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800">User Not Found</div>

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="pt-24 pb-10 px-4 flex justify-center">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-white relative animate-fadeIn">
                    
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 border border-slate-700 rounded-full text-indigo-300 hover:text-white transition-all duration-300 backdrop-blur-sm z-10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Profile Header */}
                    <div className="flex flex-col items-center gap-4 mb-8 mt-6 sm:mt-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg relative group">
                            {profileData.image ? 
                                <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" /> :
                                <div className='w-full h-full bg-black flex items-center justify-center text-3xl'>
                                    {profileData.name[0].toUpperCase()}
                                </div>
                            }
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold">{profileData.name}</h1>
                            <div className='flex items-center justify-center gap-2 text-indigo-300 text-sm mt-1'>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>{profileData.location || 'No Location'}</span>
                                {profileData.nationality && <span>• {profileData.nationality}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                        
                        {/* Basic Details */}
                        <div className="bg-[#333A5C] p-5 rounded-xl border border-indigo-500/20">
                            <span className="text-indigo-300 block mb-2 font-bold uppercase text-xs tracking-wider">Basic Info</span>
                            <div className="space-y-2">
                                <p className="flex justify-between"><span className="text-gray-400">Age:</span> <span className="font-medium">{profileData.age || 'N/A'}</span></p>
                                <p className="flex justify-between"><span className="text-gray-400">Gender:</span> <span className="font-medium">{profileData.gender || 'N/A'}</span></p>
                                <p className="flex justify-between"><span className="text-gray-400">Status:</span> <span className="font-medium">{profileData.status || 'N/A'}</span></p>
                            </div>
                        </div>

                        {/* Education/Work */}
                        <div className="bg-[#333A5C] p-5 rounded-xl border border-indigo-500/20">
                            <span className="text-indigo-300 block mb-2 font-bold uppercase text-xs tracking-wider">Occupation / Institution</span>
                            <p className="text-lg font-medium">{profileData.institution || 'N/A'}</p>
                        </div>

                        {/* Languages */}
                        <div className="bg-[#333A5C] p-5 rounded-xl border border-indigo-500/20">
                            <span className="text-indigo-300 block mb-2 font-bold uppercase text-xs tracking-wider">Languages</span>
                            <p className="text-lg">
                                {Array.isArray(profileData.languages) && profileData.languages.length > 0 
                                    ? profileData.languages.join(', ') 
                                    : 'N/A'}
                            </p>
                        </div>

                        {/* Personality & Hobbies */}
                        <div className="bg-[#333A5C] p-5 rounded-xl border border-indigo-500/20 col-span-1 md:col-span-2 lg:col-span-1">
                            <span className="text-indigo-300 block mb-2 font-bold uppercase text-xs tracking-wider">About</span>
                            <p className="mb-2"><span className="text-gray-400">Type:</span> <span className="font-medium">{profileData.personalityType || 'N/A'}</span></p>
                            <div>
                                <span className="text-gray-400 block mb-1">Hobbies:</span>
                                <p className="font-medium">{Array.isArray(profileData.hobbies) ? profileData.hobbies.join(', ') : profileData.hobbies}</p>
                            </div>
                        </div>

                        {/* Lifestyle Habits */}
                        <div className="bg-[#333A5C] p-5 rounded-xl border border-indigo-500/20 col-span-1 md:col-span-2">
                            <span className="text-indigo-300 block mb-4 font-bold uppercase text-xs tracking-wider">Lifestyle & Habits</span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-gray-400 text-xs block mb-1">Food</span>
                                    <span className="font-medium">{profileData.foodHabits || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block mb-1">Sleep</span>
                                    <span className="font-medium">{profileData.sleepSchedule || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block mb-1">Cleanliness</span>
                                    <span className="font-medium">{profileData.cleanlinessLevel || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 text-xs block mb-1">Noise</span>
                                    <span className="font-medium">{profileData.noiseTolerance || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-8 border-b border-slate-700/50"></div>

                    {/* Preferences Toggles Display */}
                    <div className="mb-8">
                        <h3 className="text-indigo-300 mb-4 font-bold uppercase text-xs tracking-wider">Preferences & Dealbreakers</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium">
                            <div className="flex items-center gap-3 bg-[#333A5C] p-3 rounded-lg justify-center border border-indigo-500/10">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${profileData.smoker ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'}`}></div>
                                <span>{profileData.smoker ? "Smoker" : "Non-Smoker"}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#333A5C] p-3 rounded-lg justify-center border border-indigo-500/10">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${profileData.drinking ? 'bg-red-500 shadow-red-500/50' : 'bg-green-500 shadow-green-500/50'}`}></div>
                                <span>{profileData.drinking ? "Drinker" : "Non-Drinker"}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#333A5C] p-3 rounded-lg justify-center border border-indigo-500/10">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${profileData.visitors ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                                <span>{profileData.visitors ? "Visitors OK" : "No Visitors"}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-[#333A5C] p-3 rounded-lg justify-center border border-indigo-500/10">
                                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px] ${profileData.petsAllowed ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
                                <span>{profileData.petsAllowed ? "Pets OK" : "No Pets"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="flex justify-center">
                         <button 
                            onClick={handleSendRequest}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-12 rounded-full shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                         >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Send Request
                         </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewProfile