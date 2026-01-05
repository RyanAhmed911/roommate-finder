// Created by Prachurzo

import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const FavouriteRoommates = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [roommates, setRoommates] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchFavouriteRoommates = async () => {
        try {
            setLoading(true)
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/favorite-roommates`)
            if (data.success) {
                setRoommates(data.roommates || [])
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!userData) {
            navigate('/login')
            return
        }
        fetchFavouriteRoommates()
    }, [userData])

    const removeFavorite = async (roommateId) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(`${backendUrl}/api/favorite-roommates/remove`, { roommateID: roommateId })
            
            if (data.success) {
                toast.success(data.message)
                fetchFavouriteRoommates() // Refresh the list to remove the card
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSendRequest = async (userId) => {
        if (!userData) {
            toast.error("Please login to send a request")
            navigate('/login')
            return
        }

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (data.success) {
                if (data.rooms.length === 0) {
                    toast.info("Please post your room details before sending requests.")
                    navigate('/post-room')
                } else {
                    const { data: inviteData } = await axios.post(backendUrl + '/api/request/send', { receiverId: userId })
                    if (inviteData.success) {
                        toast.success(inviteData.message)
                    } else {
                        toast.error(inviteData.message)
                    }
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">Favorite Roommates</h1>
                    <p className="text-slate-400">People you have shortlisted to connect with.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : roommates.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">👥</div>
                        <p className="text-xl text-slate-400">No favorite roommates yet.</p>
                        <button onClick={() => navigate('/roommates')} className="mt-4 text-indigo-400 hover:text-indigo-300">Browse Roommates</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {roommates.map((user) => (
                            <div key={user._id} className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-700 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full group">
                                
                                <div className="w-full h-72 relative bg-slate-800 group overflow-hidden">
                                    <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
                                                <span className="text-6xl font-bold opacity-50">{user.name[0].toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
                                            <p className="text-indigo-400 font-medium text-sm mt-0.5">{user.institution || 'N/A'}</p>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeFavorite(user._id)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center bg-pink-500/10 text-pink-500 border border-pink-500/20 hover:bg-pink-500/20 transition-all"
                                                title="Remove from favorites"
                                            >
                                                <svg className="w-4 h-4 fill-current" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            </button>

                                            {user.age && (
                                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full font-bold border border-slate-700">
                                                    {user.age} yo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                                            {user.gender || 'Any'}
                                        </span>
                                        
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.smoker ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-green-900/30 text-green-400 border-green-800'}`}>
                                            {user.smoker ? 'Smoker' : 'Non-Smoker'}
                                        </span>

                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.drinking ? 'bg-purple-900/30 text-purple-400 border-purple-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {user.drinking ? 'Drinker' : 'No Drink'}
                                        </span>

                                        {user.foodHabits && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-orange-900/30 text-orange-400 border border-orange-800">
                                                {user.foodHabits}
                                            </span>
                                        )}

                                        {user.cleanlinessLevel && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-teal-900/30 text-teal-400 border border-teal-800">
                                                {user.cleanlinessLevel} Clean
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1"></div>

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button onClick={() => handleSendRequest(user._id)} className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">Send Request</button>
                                        <button onClick={() => navigate(`/view-profile/${user._id}`)} className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-700 hover:text-white transition-all">View Profile</button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default FavouriteRoommates
// Created by Prachurzo