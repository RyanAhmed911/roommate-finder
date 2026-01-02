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

    const fetchFavouriteRoommates = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/favorites`)
            if (data.success) {
                const usersMap = {}

                // ✅ FIX: room.users is an ARRAY
                data.rooms.forEach(room => {
                    if (Array.isArray(room.users)) {
                        room.users.forEach(user => {
                            usersMap[user._id] = user
                        })
                    }
                })

                setRoommates(Object.values(usersMap))
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    useEffect(() => {
        if (!userData) {
            navigate('/login')
            return
        }
        fetchFavouriteRoommates()
    }, [userData])

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Favourite Roommates</h1>
                    <p className="text-slate-500">People who posted your favourite rooms</p>
                </div>

                {roommates.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                        <p className="text-slate-500 text-lg">No favorite roommates yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roommates.map(user => (
                            <div key={user._id} className="bg-white rounded-2xl shadow-lg border p-6">
                                <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                                <p className="text-slate-500">{user.email}</p>
                                <span className="inline-block mt-3 px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                                    {user.gender}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default FavouriteRoommates
