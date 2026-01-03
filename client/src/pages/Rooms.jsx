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
    const [favoriteRoomIds, setFavoriteRoomIds] = useState(new Set())

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

    const fetchFavoriteRooms = async () => {
        if (!userData) {
            setFavoriteRoomIds(new Set())
            return
        }

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/favorites`)
            if (data.success) {
                const ids = (data.rooms || []).map(r => (typeof r === 'string' ? r : r?._id)).filter(Boolean)
                setFavoriteRoomIds(new Set(ids))
            }
        } catch (error) {
            // Don't block the Rooms page if favorites fail
            console.error(error)
        }
    }

    const toggleFavorite = async (roomId) => {
        if (!userData) {
            toast.error('Please login to save favorite rooms')
            navigate('/login')
            return
        }

        const isFav = favoriteRoomIds.has(roomId)

        try {
            axios.defaults.withCredentials = true
            const endpoint = isFav ? `${backendUrl}/api/favorites/remove` : `${backendUrl}/api/favorites/add`
            const { data } = await axios.post(endpoint, { roomID: roomId })

            if (!data.success) {
                toast.error(data.message)
                return
            }

            setFavoriteRoomIds(prev => {
                const next = new Set(prev)
                if (isFav) next.delete(roomId)
                else next.add(roomId)
                return next
            })

            toast.success(isFav ? 'Removed from favorites' : 'Added to favorites')
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

    useEffect(() => {
        fetchFavoriteRooms()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData])

    //Nusayba: Added compatibility score button

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

                        const isFavorite = favoriteRoomIds.has(room._id)

                        return(
                        <div key={room._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow flex flex-col h-full">
                            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                                <div className="flex items-center gap-2 min-w-0">
                                    <h3 className="font-bold text-lg truncate">{room.location}</h3>
                                    <button
                                        type="button"
                                        onClick={() => toggleFavorite(room._id)}
                                        className={`p-1 rounded-full transition-colors ${isFavorite ? 'bg-yellow-400/20 text-yellow-200' : 'bg-white/10 text-white/90 hover:bg-white/20'}`}
                                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill={isFavorite ? 'currentColor' : 'none'}
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    </button>
                                </div>

                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">৳ {room.rent}</span>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Area</span>
                                        <span className="font-semibold">{room.area} sq ft</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Floor</span>
                                        <span className="font-semibold">{room.floor}th</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Capacity</span>
                                        <span className="font-semibold">{room.capacity} Person(s)</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 uppercase font-bold">Joined</span>
                                        <span className="font-semibold">{room.users?.length || 0} Member(s)</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mb-6">
                                    {room.balcony && (
                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">Balcony</span>
                                    )}
                                    {room.attachedBathroom && (
                                        <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs font-bold">Attached Bath</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                                        {room.users && room.users[0] && room.users[0].image ? (
                                            <img src={room.users[0].image} className="w-full h-full object-cover" alt="Owner" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                                {room.users && room.users[0] ? room.users[0].name[0] : '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">
                                            {room.users && room.users[0] ? room.users[0].name : 'Unknown Owner'}
                                        </p>
                                        <p className="text-xs text-slate-500">Room Owner</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-4">
                                    <button 
                                        onClick={() => setSelectedRoom(room)}
                                        className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button 
                                        onClick={() => handleJoinRequest(room._id)}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                        Request to Join
                                    </button>

                                        {!isOwnRoom && (
                                            <button
                                                onClick={() => checkCompatibility(room._id)}
                                                className="w-full bg-purple-600 text-white py-2 rounded-lg"
                                            >
                                                Check Compatibility
                                            </button>
                                        )}

                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {selectedRoom && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
                        <div className="bg-indigo-600 p-6 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedRoom.location}</h2>
                                <p className="text-indigo-200">Posted by {selectedRoom.users?.[0]?.name}</p>
                            </div>
                            <button 
                                onClick={() => setSelectedRoom(null)}
                                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
                                    <p className="text-2xl font-bold text-indigo-600">৳ {selectedRoom.rent}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-sm text-slate-500 mb-1">Apartment Size</p>
                                    <p className="text-2xl font-bold text-slate-800">{selectedRoom.area} <span className="text-sm font-normal text-slate-500">sq ft</span></p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Room Details</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Floor Level</span>
                                            <span className="font-semibold text-slate-800">{selectedRoom.floor}th Floor</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Capacity</span>
                                            <span className="font-semibold text-slate-800">{selectedRoom.capacity} Person(s)</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Balcony</span>
                                            <span className={`font-semibold ${selectedRoom.balcony ? 'text-green-600' : 'text-red-500'}`}>{selectedRoom.balcony ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Attached Bath</span>
                                            <span className={`font-semibold ${selectedRoom.attachedBathroom ? 'text-green-600' : 'text-red-500'}`}>{selectedRoom.attachedBathroom ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 border-b pb-2">Roommate Preferences</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRoom.personalityType && (
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                                                {selectedRoom.personalityType}
                                            </span>
                                        )}
                                        {selectedRoom.cleanlinessLevel && (
                                            <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium">
                                                {selectedRoom.cleanlinessLevel} Clean
                                            </span>
                                        )}
                                        {selectedRoom.smoker ? (
                                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">Smoker Allowed</span>
                                        ) : (
                                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">Non-Smoker</span>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedRoom.visitors ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {selectedRoom.visitors ? '👥 Visitors OK' : '🚫 No Visitors'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedRoom.petsAllowed ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {selectedRoom.petsAllowed ? '🐾 Pets Allowed' : '🚫 No Pets'}
                                        </span>
                                    </div>
                                </div>

                                {selectedRoom.medicalConditions?.length > 0 && (
                                    <div>
                                        <p className="text-sm text-slate-500">Medical Considerations</p>
                                        <p className="font-semibold text-red-600">{selectedRoom.medicalConditions.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <button 
                                onClick={() => handleJoinRequest(selectedRoom._id)}
                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Request to Join Room
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Rooms
