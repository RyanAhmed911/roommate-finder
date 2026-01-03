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
                    toast.info("Request feature coming soon!")
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const removeFromFavorites = async (roommateId) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(`${backendUrl}/api/favorite-roommates/remove`, { roommateID: roommateId })

            if (data.success) {
                setRoommates(prev => prev.filter(u => u._id !== roommateId))
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Favourite Roommates</h1>
                    <p className="text-slate-500">People you have saved</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : roommates.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                        <p className="text-slate-500 text-lg">No favorite roommates yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {roommates.map((user, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                
                                <div className="w-full h-72 relative bg-gray-200 group overflow-hidden">
                                    <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                                <span className="text-6xl font-bold opacity-80">{user.name[0].toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                                        <span className="text-xs font-bold text-slate-500">Match</span>
                                        <span className="text-sm font-black text-green-600">85%</span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{user.name}</h3>
                                            <p className="text-indigo-500 font-medium text-sm mt-0.5">{user.institution || 'N/A'}</p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <button
                                                onClick={() => removeFromFavorites(user._id)}
                                                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-200 transition-all"
                                                title="Remove from favorites"
                                            >
                                                ★
                                            </button>

                                            {user.age && (
                                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold border border-slate-200">
                                                    {user.age} yo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                            {user.gender || 'Any'}
                                        </span>
                                        
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.smoker ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {user.smoker ? 'Smoker' : 'Non-Smoker'}
                                        </span>

                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.drinking ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {user.drinking ? 'Drinker' : 'No Drink'}
                                        </span>

                                        {user.foodHabits && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-100">
                                                {user.foodHabits}
                                            </span>
                                        )}

                                        {user.cleanlinessLevel && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-100">
                                                {user.cleanlinessLevel} Clean
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1"></div>

                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button onClick={() => handleSendRequest(user._id)} className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">Request</button>
                                        <button onClick={() => navigate(`/view-profile/${user._id}`)} className="py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">View Profile</button>
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
