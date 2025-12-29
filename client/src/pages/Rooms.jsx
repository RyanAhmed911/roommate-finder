import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Rooms = () => {
    const { backendUrl } = useContext(AppContent)
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
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
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

                                {/* Roommate Preferences Section */}
                                {(room.personalityType || room.hobbies?.length > 0 || room.foodHabits) && (
                                    <div className="border-t pt-4 mb-4">
                                        <h4 className="text-xs font-bold text-indigo-600 mb-2">Looking for Roommate:</h4>
                                        
                                        {room.personalityType && (
                                            <p className="text-xs text-slate-600 mb-1">
                                                <span className="font-semibold">Type:</span> {room.personalityType}
                                            </p>
                                        )}
                                        
                                        {room.hobbies?.length > 0 && (
                                            <p className="text-xs text-slate-600 mb-1">
                                                <span className="font-semibold">Hobbies:</span> {room.hobbies.join(', ')}
                                            </p>
                                        )}

                                        {/* Lifestyle badges */}
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {room.foodHabits && (
                                                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                                                    {room.foodHabits}
                                                </span>
                                            )}
                                            {room.sleepSchedule && (
                                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                                    {room.sleepSchedule}
                                                </span>
                                            )}
                                            {room.cleanlinessLevel && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                    {room.cleanlinessLevel}
                                                </span>
                                            )}
                                        </div>

                                        {/* Preferences icons */}
                                        <div className="flex gap-2 mt-3">
                                            {!room.smoker && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    🚭 Non-Smoker
                                                </span>
                                            )}
                                            {room.petsAllowed && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                                    🐾 Pets OK
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Owner Info */}
                                <div className="flex items-center gap-3 border-t pt-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        {room.users && room.users.length > 0 && room.users[0].image ? 
                                            <img src={room.users[0].image} className="w-full h-full object-cover" alt="Owner"/> : 
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                                {room.users && room.users.length > 0 ? room.users[0].name[0] : '?'}
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">
                                            {room.users && room.users.length > 0 ? room.users[0].name : 'Unknown Owner'}
                                        </p>
                                        <p className="text-xs text-slate-500">Owner</p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setSelectedRoom(room)}
                                    className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for full details */}
            {selectedRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRoom(null)}>
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{selectedRoom.location}</h2>
                                <p className="text-3xl font-bold text-indigo-600 mt-2">৳ {selectedRoom.rent}/month</p>
                            </div>
                            <button onClick={() => setSelectedRoom(null)} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs text-slate-500">Area</p>
                                <p className="font-bold text-slate-800">{selectedRoom.area} sq ft</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs text-slate-500">Floor</p>
                                <p className="font-bold text-slate-800">{selectedRoom.floor}th</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs text-slate-500">Capacity</p>
                                <p className="font-bold text-slate-800">{selectedRoom.capacity} person(s)</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-xs text-slate-500">Bathroom</p>
                                <p className="font-bold text-slate-800">{selectedRoom.attachedBathroom ? 'Attached' : 'Common'}</p>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Looking for Roommate With:</h3>
                            
                            <div className="space-y-4">
                                {selectedRoom.personalityType && (
                                    <div>
                                        <p className="text-sm text-slate-500">Personality Type</p>
                                        <p className="font-semibold text-slate-800">{selectedRoom.personalityType}</p>
                                    </div>
                                )}

                                {selectedRoom.hobbies?.length > 0 && (
                                    <div>
                                        <p className="text-sm text-slate-500">Hobbies</p>
                                        <p className="font-semibold text-slate-800">{selectedRoom.hobbies.join(', ')}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {selectedRoom.foodHabits && (
                                        <div>
                                            <p className="text-sm text-slate-500">Food Habits</p>
                                            <p className="font-semibold text-slate-800">{selectedRoom.foodHabits}</p>
                                        </div>
                                    )}
                                    {selectedRoom.sleepSchedule && (
                                        <div>
                                            <p className="text-sm text-slate-500">Sleep Schedule</p>
                                            <p className="font-semibold text-slate-800">{selectedRoom.sleepSchedule}</p>
                                        </div>
                                    )}
                                    {selectedRoom.cleanlinessLevel && (
                                        <div>
                                            <p className="text-sm text-slate-500">Cleanliness</p>
                                            <p className="font-semibold text-slate-800">{selectedRoom.cleanlinessLevel}</p>
                                        </div>
                                    )}
                                    {selectedRoom.noiseTolerance && (
                                        <div>
                                            <p className="text-sm text-slate-500">Noise Tolerance</p>
                                            <p className="font-semibold text-slate-800">{selectedRoom.noiseTolerance}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-sm text-slate-500 mb-2">Preferences</p>
                                    <div className="flex flex-wrap gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedRoom.smoker ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {selectedRoom.smoker ? '🚬 Smoker OK' : '🚭 Non-Smoker'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedRoom.drinking ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {selectedRoom.drinking ? '🍺 Drinking OK' : '🚫 No Drinking'}
                                        </span>
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

                        <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors">
                            Contact Owner
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Rooms