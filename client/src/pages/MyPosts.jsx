// Created by Prachurzo 

import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const MyPosts = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [myRooms, setMyRooms] = useState([])
    const [editingRoom, setEditingRoom] = useState(null)
    const [loading, setLoading] = useState(false)

    const [location, setLocation] = useState('')
    const [rent, setRent] = useState('')
    const [capacity, setCapacity] = useState(1)
    const [floor, setFloor] = useState('')
    const [area, setArea] = useState('')
    const [balcony, setBalcony] = useState(false)
    const [attachedBathroom, setAttachedBathroom] = useState(false)
    const [personalityType, setPersonalityType] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [foodHabits, setFoodHabits] = useState('')
    const [sleepSchedule, setSleepSchedule] = useState('')
    const [cleanlinessLevel, setCleanlinessLevel] = useState('')
    const [noiseTolerance, setNoiseTolerance] = useState('')
    const [medicalConditions, setMedicalConditions] = useState('')
    const [smoker, setSmoker] = useState(false)
    const [drinking, setDrinking] = useState(false)
    const [visitors, setVisitors] = useState(false)
    const [petsAllowed, setPetsAllowed] = useState(false)

    const fetchMyRooms = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
            if (data.success) {
                // FIXED: Filter to only show rooms that are POSTED (status === true)
                const postedRooms = data.rooms.filter(room => room.status === true)
                setMyRooms(postedRooms)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (!userData) {
            navigate('/login')
            return
        }
        fetchMyRooms()
    }, [userData])

    const handleEdit = (room) => {
        setEditingRoom(room)
        setLocation(room.location)
        setRent(room.rent)
        setCapacity(room.capacity)
        setFloor(room.floor)
        setArea(room.area)
        setBalcony(room.balcony)
        setAttachedBathroom(room.attachedBathroom)
        setPersonalityType(room.personalityType || '')
        setHobbies(Array.isArray(room.hobbies) ? room.hobbies.join(', ') : '')
        setFoodHabits(room.foodHabits || '')
        setSleepSchedule(room.sleepSchedule || '')
        setCleanlinessLevel(room.cleanlinessLevel || '')
        setNoiseTolerance(room.noiseTolerance || '')
        setMedicalConditions(Array.isArray(room.medicalConditions) ? room.medicalConditions.join(', ') : '')
        setSmoker(room.smoker || false)
        setDrinking(room.drinking || false)
        setVisitors(room.visitors || false)
        setPetsAllowed(room.petsAllowed || false)
    }

    const handleUpdate = async () => {
        if (!editingRoom) return
        
        setLoading(true)
        
        const hobbiesArray = hobbies.split(',').map(h => h.trim()).filter(h => h)
        const medicalArray = medicalConditions.split(',').map(m => m.trim()).filter(m => m)

        try {
            axios.defaults.withCredentials = true
            
            const payload = {
                location,
                rent: Number(rent),
                capacity: Number(capacity),
                floor: Number(floor),
                area: Number(area),
                balcony,
                attachedBathroom,
                personalityType,
                hobbies: hobbiesArray,
                foodHabits,
                sleepSchedule,
                cleanlinessLevel,
                noiseTolerance,
                medicalConditions: medicalArray,
                smoker,
                drinking,
                visitors,
                petsAllowed
            }

            const { data } = await axios.put(backendUrl + `/api/room/${editingRoom._id}`, payload)

            if (data.success) {
                toast.success('Room updated successfully!')
                setEditingRoom(null)
                fetchMyRooms()
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Failed to update room')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (roomId) => {
        if (!window.confirm('Are you sure you want to delete this room post?')) return

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.delete(backendUrl + `/api/room/${roomId}`)

            if (data.success) {
                toast.success('Room deleted successfully!')
                fetchMyRooms()
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Failed to delete room')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">
                
                {/* Header with Post Room Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 text-center sm:text-left">My Room Posts</h1>
                        <p className="text-slate-500 text-center sm:text-left">Manage your room listings</p>
                    </div>
                    <button 
                        onClick={() => navigate('/post-room')}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Post Room
                    </button>
                </div>

                {myRooms.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-slate-500 mb-4 text-lg">You haven't posted any rooms yet.</p>
                        <button 
                            onClick={() => navigate('/post-room')}
                            className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                            Post your first room
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {myRooms.map((room) => (
                            <div key={room._id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                                <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                                    <h3 className="font-bold text-lg">{room.location}</h3>
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">৳ {room.rent}</span>
                                </div>

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
                                            <span className="text-xs text-slate-400">Capacity</span>
                                            <span className="font-semibold">{room.capacity} person(s)</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400">Status</span>
                                            <span className={`font-semibold ${room.status ? 'text-green-600' : 'text-red-600'}`}>
                                                {room.status ? 'Available' : 'Full'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => handleEdit(room)}
                                            className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors border border-indigo-200">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(room._id)}
                                            className="flex-1 bg-red-50 text-red-700 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors border border-red-200">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
                    <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white my-8">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                            <h2 className="text-2xl font-bold">Edit Room Post</h2>
                            <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Room Details Section */}
                            <div className="bg-[#1e2746] p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                    Room Details
                                </h3>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-indigo-300 mb-1 text-sm">Location</label>
                                        <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="text" value={location} onChange={e => setLocation(e.target.value)} />
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-indigo-300 mb-1 text-sm">Rent (BDT)</label>
                                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="number" value={rent} onChange={e => setRent(e.target.value)} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-indigo-300 mb-1 text-sm">Capacity</label>
                                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-indigo-300 mb-1 text-sm">Floor No.</label>
                                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="number" value={floor} onChange={e => setFloor(e.target.value)} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-indigo-300 mb-1 text-sm">Area (sq ft)</label>
                                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="number" value={area} onChange={e => setArea(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between mt-2 px-2">
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Balcony Available</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={attachedBathroom} onChange={e => setAttachedBathroom(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Attached Bath</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences Section */}
                            <div className="bg-[#1e2746] p-6 rounded-xl border border-slate-700">
                                <h3 className="text-xl font-semibold text-indigo-300 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                    Roommate Preferences
                                </h3>

                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="block text-indigo-300 mb-1 text-sm">Personality Type</label>
                                        <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="text" value={personalityType} onChange={e => setPersonalityType(e.target.value)} />
                                    </div>

                                    <div>
                                        <label className="block text-indigo-300 mb-1 text-sm">Hobbies (comma separated)</label>
                                        <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="text" value={hobbies} onChange={e => setHobbies(e.target.value)} />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-indigo-300 mb-1 text-sm">Food Habits</label>
                                            <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-600 focus:border-indigo-500 transition-colors" value={foodHabits} onChange={e => setFoodHabits(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="Vegetarian">Vegetarian</option>
                                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                                                <option value="Vegan">Vegan</option>
                                                <option value="Flexible">Flexible</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-indigo-300 mb-1 text-sm">Sleep Schedule</label>
                                            <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-600 focus:border-indigo-500 transition-colors" value={sleepSchedule} onChange={e => setSleepSchedule(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="Early Bird">Early Bird</option>
                                                <option value="Night Owl">Night Owl</option>
                                                <option value="Flexible">Flexible</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-indigo-300 mb-1 text-sm">Cleanliness Level</label>
                                            <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-600 focus:border-indigo-500 transition-colors" value={cleanlinessLevel} onChange={e => setCleanlinessLevel(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="Very Clean">Very Clean</option>
                                                <option value="Moderate">Moderate</option>
                                                <option value="Relaxed">Relaxed</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-indigo-300 mb-1 text-sm">Noise Tolerance</label>
                                            <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-600 focus:border-indigo-500 transition-colors" value={noiseTolerance} onChange={e => setNoiseTolerance(e.target.value)}>
                                                <option value="">Select</option>
                                                <option value="Quiet">Quiet</option>
                                                <option value="Moderate">Moderate</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-indigo-300 mb-1 text-sm">Medical Conditions (comma separated)</label>
                                        <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-600 focus:border-indigo-500 transition-colors" type="text" value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Smoker</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={drinking} onChange={e => setDrinking(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Drinker</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={visitors} onChange={e => setVisitors(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Visitors Allowed</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-300 transition-colors">
                                            <input type="checkbox" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                            <span>Pets Allowed</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6 border-t border-slate-700 pt-6">
                            <button 
                                onClick={() => setEditingRoom(null)}
                                className="flex-1 bg-slate-700 text-white py-3 rounded-full font-bold hover:bg-slate-600 transition-colors">
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdate}
                                disabled={loading}
                                className={`flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-full font-bold hover:scale-105 transition-all shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                                {loading ? 'Updating...' : 'Update Room'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyPosts