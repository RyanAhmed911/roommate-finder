import React, { useContext, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ViewProfile = () => {
    const { id } = useParams() // Get the User ID from the URL
    const navigate = useNavigate()
    const { backendUrl } = useContext(AppContent)
    
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
                navigate(-1) // Go back if user not found
            }
        } catch (error) {
            toast.error("Error fetching profile")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserProfile()
    }, [id])

    if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
    if (!profileData) return <div className="min-h-screen flex items-center justify-center text-white">User Not Found</div>

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 py-10 px-4 flex justify-center">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-4xl text-white mt-10 relative animate-fadeIn">
                
                {/* Back Button */}
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-indigo-300 hover:text-white flex items-center gap-1">
                    &larr; Back
                </button>

                {/* Profile Header */}
                <div className="flex flex-col items-center gap-4 mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
                        {profileData.image ? 
                            <img src={profileData.image} alt="Profile" className="w-full h-full object-cover" /> :
                            <div className='w-full h-full bg-black flex items-center justify-center text-3xl'>
                                {profileData.name[0].toUpperCase()}
                            </div>
                        }
                    </div>
                    <h1 className="text-3xl font-bold">{profileData.name}</h1>
                    <div className='flex gap-2 text-indigo-300 text-sm'>
                        <span>{profileData.location || 'No Location'}</span>
                        {profileData.nationality && <span>• {profileData.nationality}</span>}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    
                    {/* Basic Details */}
                    <div className="bg-[#333A5C] p-4 rounded-lg">
                        <span className="text-indigo-300 block mb-1 font-medium">Basic Info</span>
                        <p><span className="text-gray-400">Age:</span> {profileData.age || 'N/A'}</p>
                        <p><span className="text-gray-400">Gender:</span> {profileData.gender || 'N/A'}</p>
                        <p><span className="text-gray-400">Status:</span> {profileData.status || 'N/A'}</p>
                    </div>

                    {/* Education/Work */}
                    <div className="bg-[#333A5C] p-4 rounded-lg">
                        <span className="text-indigo-300 block mb-1 font-medium">Occupation / Institution</span>
                        <p className="text-lg">{profileData.institution || 'N/A'}</p>
                    </div>

                    {/* Languages */}
                    <div className="bg-[#333A5C] p-4 rounded-lg">
                        <span className="text-indigo-300 block mb-1 font-medium">Languages</span>
                        <p className="text-lg">
                            {Array.isArray(profileData.languages) && profileData.languages.length > 0 
                                ? profileData.languages.join(', ') 
                                : 'N/A'}
                        </p>
                    </div>

                    {/* Personality & Hobbies */}
                    <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2 lg:col-span-1">
                        <span className="text-indigo-300 block mb-1 font-medium">About</span>
                        <p><span className="text-gray-400">Type:</span> {profileData.personalityType || 'N/A'}</p>
                        <p className="mt-1">
                            <span className="text-gray-400">Hobbies:</span> {Array.isArray(profileData.hobbies) ? profileData.hobbies.join(', ') : profileData.hobbies}
                        </p>
                    </div>

                    {/* Lifestyle Habits */}
                    <div className="bg-[#333A5C] p-4 rounded-lg col-span-1 md:col-span-2">
                        <span className="text-indigo-300 block mb-3 font-medium">Lifestyle & Habits</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                                <span className="text-gray-400 text-xs block">Food</span>
                                <span>{profileData.foodHabits || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs block">Sleep</span>
                                <span>{profileData.sleepSchedule || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs block">Cleanliness</span>
                                <span>{profileData.cleanlinessLevel || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 text-xs block">Noise</span>
                                <span>{profileData.noiseTolerance || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="my-6 border-b border-slate-700"></div>

                {/* Preferences Toggles Display */}
                <h3 className="text-indigo-300 mb-4 font-medium">Preferences & Dealbreakers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                        <div className={`w-3 h-3 rounded-full ${profileData.smoker ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <span>{profileData.smoker ? "Smoker" : "Non-Smoker"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                        <div className={`w-3 h-3 rounded-full ${profileData.drinking ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        <span>{profileData.drinking ? "Drinker" : "Non-Drinker"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                        <div className={`w-3 h-3 rounded-full ${profileData.visitors ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{profileData.visitors ? "Visitors OK" : "No Visitors"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#333A5C] p-3 rounded-full justify-center">
                        <div className={`w-3 h-3 rounded-full ${profileData.petsAllowed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span>{profileData.petsAllowed ? "Pets OK" : "No Pets"}</span>
                    </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-8 flex justify-center">
                     <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-transform hover:scale-105">
                        Send Request
                     </button>
                </div>
            </div>
        </div>
    )
}

export default ViewProfile