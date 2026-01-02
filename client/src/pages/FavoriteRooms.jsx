// Created by Prachurzo

import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const FavouriteRooms = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])

    const fetchFavouriteRooms = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/favorites`)
            if (data.success) {
                setRooms(data.rooms)
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const removeFromFavorites = async (roomID) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(
                `${backendUrl}/api/favorites/remove`,
                { roomID }
            )

            if (data.success) {
                toast.success('Removed from favorites')
                fetchFavouriteRooms()
            } else {
                toast.error(data.message)
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
        fetchFavouriteRooms()
    }, [userData])

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Favourite Rooms</h1>
                    <p className="text-slate-500">Rooms you have saved</p>
                </div>

                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                        <p className="text-slate-500 text-lg">No favorite rooms yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map(room => (
                            <div key={room._id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl">
                                <div className="bg-indigo-600 p-4 text-white flex justify-between">
                                    <h3 className="font-bold">{room.location}</h3>
                                    <span className="font-semibold">৳ {room.rent}</span>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                                        <div>
                                            <span className="text-xs text-slate-400">Area</span>
                                            <p className="font-semibold">{room.area} sq ft</p>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400">Capacity</span>
                                            <p className="font-semibold">{room.capacity}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeFromFavorites(room._id)}
                                        className="mt-6 w-full bg-red-50 text-red-700 py-2 rounded-lg font-bold hover:bg-red-100 border"
                                    >
                                        Remove from Favorites
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default FavouriteRooms
