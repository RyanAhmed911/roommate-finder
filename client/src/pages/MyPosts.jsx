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
    const [allRooms, setAllRooms] = useState([]) // To check if user has ANY room
    const [activePosts, setActivePosts] = useState([]) // To show only POSTED rooms
    const [editingRoom, setEditingRoom] = useState(null)
    const [loading, setLoading] = useState(false)

    // Form States for Edit Modal
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
                setAllRooms(data.rooms)
                // Only show rooms that are currently active (posted)
                const posted = data.rooms.filter(room => room.status === true)
                setActivePosts(posted)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchMyRooms()
        } else {
            navigate('/login')
        }
    }, [userData])

    // Logic: Unpost the room (Status = false) instead of deleting data
    const handleDeletePost = async (roomId) => {
        if (!window.confirm("Are you sure you want to remove this post? The room will remain in your dashboard.")) return
        
        try {
            axios.defaults.withCredentials = true
            // Update status to false (Unpost)
            const { data } = await axios.put(backendUrl + '/api/room/' + roomId, { status: false })
            
            if (data.success) {
                toast.success("Post removed successfully")
                fetchMyRooms()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Logic: Check room existence before navigating
    const handleCreatePost = () => {
        if (allRooms.length === 0) {
            toast.info("You need to create a room first.")
            navigate('/my-room')
        } else {
            navigate('/post-room')
        }
    }

    const startEditing = (room) => {
        setEditingRoom(room)
        setLocation(room.location)
        setRent(room.rent)
        setCapacity(room.capacity)
        setFloor(room.floor)
        setArea(room.area)
        setBalcony(room.balcony || false)
        setAttachedBathroom(room.attachedBathroom || false)
        setPersonalityType(room.personalityType || '')
        setHobbies(room.hobbies ? room.hobbies.join(', ') : '')
        setFoodHabits(room.foodHabits || '')
        setSleepSchedule(room.sleepSchedule || '')
        setCleanlinessLevel(room.cleanlinessLevel || '')
        setNoiseTolerance(room.noiseTolerance || '')
        setMedicalConditions(room.medicalConditions ? room.medicalConditions.join(', ') : '')
        setSmoker(room.smoker || false)
        setDrinking(room.drinking || false)
        setVisitors(room.visitors || false)
        setPetsAllowed(room.petsAllowed || false)
    }

    const handleUpdate = async () => {
        if (!editingRoom) return
        setLoading(true)
        try {
            axios.defaults.withCredentials = true
            const hobbiesArray = hobbies.split(',').map(h => h.trim()).filter(Boolean)
            const medicalArray = medicalConditions.split(',').map(m => m.trim()).filter(Boolean)

            const { data } = await axios.put(backendUrl + '/api/room/' + editingRoom._id, {
                location, rent, capacity, floor, area, balcony, attachedBathroom,
                personalityType, hobbies: hobbiesArray, foodHabits, sleepSchedule,
                cleanlinessLevel, noiseTolerance, medicalConditions: medicalArray,
                smoker, drinking, visitors, petsAllowed
            })

            if (data.success) {
                toast.success("Room details updated")
                setEditingRoom(null)
                fetchMyRooms()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">My Posts</h1>
                    <p className="text-slate-400">Manage your active room listings.</p>
                </div>

                {activePosts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
                        <p className="text-xl text-slate-400">You don't have any active posts.</p>
                        
                        <button 
                            onClick={handleCreatePost} 
                            className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20 transition-all hover:scale-105"
                        >
                            Create Post
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activePosts.map(room => (
                            <div key={room._id} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-full hover:border-indigo-500/30 transition-all duration-300 group">
                                <div className="h-40 bg-slate-800 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 relative">
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-white">{room.location}</h3>
                                        <p className="text-slate-400 text-sm">৳ {room.rent} / month</p>
                                    </div>
                                    <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-green-900/30 text-green-400 border border-green-800">
                                        Active
                                    </div>
                                </div>
                                
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400 mb-6">
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span>Area</span> <span className="text-white font-medium">{room.area} sq ft</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span>Floor</span> <span className="text-white font-medium">{room.floor}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span>Capacity</span> <span className="text-white font-medium">{room.capacity}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-800 pb-2">
                                            <span>Type</span> <span className="text-white font-medium">{room.roomType || 'Shared'}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex gap-3">
                                        <button 
                                            onClick={() => startEditing(room)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-lg transition-colors shadow-lg shadow-indigo-600/20">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDeletePost(room._id)}
                                            className="flex-1 bg-slate-800 hover:bg-red-900/20 text-slate-300 hover:text-red-400 font-bold py-2 rounded-lg transition-colors border border-slate-700 hover:border-red-900/50">
                                            Delete Post
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
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-slate-900 rounded-2xl w-full max-w-3xl border border-slate-700 p-8 relative my-8 shadow-2xl animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Edit Room Details</h2>
                            <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Basic Info</h3>
                                <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" placeholder="Rent" value={rent} onChange={e => setRent(e.target.value)} />
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" placeholder="Floor" value={floor} onChange={e => setFloor(e.target.value)} />
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" placeholder="Area" value={area} onChange={e => setArea(e.target.value)} />
                                </div>
                                <div className="flex gap-4 pt-2">
                                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 w-full justify-center">
                                        <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} className="accent-indigo-500"/> <span className="text-sm">Balcony</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-800 px-3 py-2 rounded-lg border border-slate-700 w-full justify-center">
                                        <input type="checkbox" checked={attachedBathroom} onChange={e => setAttachedBathroom(e.target.checked)} className="accent-indigo-500"/> <span className="text-sm">Attached Bath</span>
                                    </label>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-4">
                                <h3 className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-2">Preferences</h3>
                                <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" placeholder="Personality Type" value={personalityType} onChange={e => setPersonalityType(e.target.value)} />
                                <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" placeholder="Hobbies (comma separated)" value={hobbies} onChange={e => setHobbies(e.target.value)} />
                                <div className="grid grid-cols-2 gap-4">
                                    <select className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" value={foodHabits} onChange={e => setFoodHabits(e.target.value)}>
                                        <option value="">Food Habits</option>
                                        <option value="Non-Vegetarian">Non-Veg</option>
                                        <option value="Vegetarian">Veg</option>
                                    </select>
                                    <select className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" value={sleepSchedule} onChange={e => setSleepSchedule(e.target.value)}>
                                        <option value="">Sleep Schedule</option>
                                        <option value="Early Bird">Early Bird</option>
                                        <option value="Night Owl">Night Owl</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-2 rounded border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                        <input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="accent-indigo-500" />
                                        <span>Smoker</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-2 rounded border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                        <input type="checkbox" checked={drinking} onChange={e => setDrinking(e.target.checked)} className="accent-indigo-500" />
                                        <span>Drinker</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-2 rounded border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                        <input type="checkbox" checked={visitors} onChange={e => setVisitors(e.target.checked)} className="accent-indigo-500" />
                                        <span>Visitors</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-2 rounded border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                        <input type="checkbox" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} className="accent-indigo-500" />
                                        <span>Pets</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 border-t border-slate-700 pt-6">
                            <button 
                                onClick={() => setEditingRoom(null)}
                                className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdate}
                                disabled={loading}
                                className={`flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
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