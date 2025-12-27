import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'

const Rooms = () => {
    const { backendUrl } = useContext(AppContent)
    const [rooms, setRooms] = useState([])

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
                    {rooms.map((room) => (
                        <div key={room._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-2xl transition-all">
                            {/* Room Header - Rent */}
                            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                                <h3 className="font-bold text-lg">{room.location}</h3>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">৳ {room.rent}</span>
                            </div>

                            {/* Room Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Area</span>
                                        <span className="font-semibold">{room.area} sq ft</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Floor</span>
                                        <span className="font-semibold">{room.floor}th</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Type</span>
                                        <span className="font-semibold">{room.attachedBathroom ? 'Attached Bath' : 'Common Bath'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">Balcony</span>
                                        <span className="font-semibold">{room.balcony ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 border-t pt-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        {/* Check if users array exists and has at least one item */}
                                        {room.users && room.users.length > 0 && room.users[0].image ? 
                                            <img src={room.users[0].image} className="w-full h-full object-cover"/> : 
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                {/* Safe access to name */}
                                                {room.users && room.users.length > 0 ? room.users[0].name[0] : '?'}
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        {/* Safe access to name */}
                                        <p className="text-sm font-bold text-slate-800">
                                            {room.users && room.users.length > 0 ? room.users[0].name : 'Unknown Owner'}
                                        </p>
                                        <p className="text-xs text-slate-500">Owner</p>
                                    </div>
                                </div>
                                
                                <button className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Rooms