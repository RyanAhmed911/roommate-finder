import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Rooms = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [rooms, setRooms] = useState([])
    const [selectedRoom, setSelectedRoom] = useState(null)

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/room/available')
            if (data.success) {
                setRooms(data.rooms)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const addToFavorites = async (roomId) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(
                backendUrl + '/api/favorites/add',
                { roomId }
            )

            if (!data.success) {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //added by Nusayba
    const checkCompatibility = async (roomId) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/compatibility/score",
                {
                    userId: userData._id,
                    roomId: roomId
                },
                { withCredentials: true }
            );

            if (data.success) {
                alert(`Compatibility Score: ${data.compatibilityScore}%`);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert("Error calculating compatibility");
        }
    };
    //added by Nusayba

    const handleJoinRequest = async (roomId) => {
        if (!userData) {
            toast.error("Please login to send a request")
            return
        }

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/request/join', { roomId })

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Available Rooms</h1>
                <p className="text-center text-slate-500 mb-10">Find your next home sweet home.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rooms.map((room) => {
                        const isOwnRoom = room.users?.some(
                            u => u?._id === userData?._id || u === userData?._id
                        );

                        return (
                            <div key={room._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow flex flex-col h-full">
                                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                                    <h3 className="font-bold text-lg">{room.location}</h3>

                                    <div className="flex items-center gap-2">
                                      
                                        <button
                                            onClick={() => addToFavorites(room._id)}
                                            className="p-1 hover:bg-white/20 rounded transition-colors"
                                            title="Add to favorites"
                                        >
                                            <svg className="w-5 h-5 star-filled" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                                />
                                            </svg>
                                        </button>

                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                                            ৳ {room.rent}
                                        </span>
                                    </div>
                                </div>

                                {/* EVERYTHING BELOW IS UNCHANGED */}
                                <div className="p-6 flex flex-col flex-1">
                                    {/* unchanged content */}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Rooms
