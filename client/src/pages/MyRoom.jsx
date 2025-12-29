import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Navbar from '../components/Navbar'

const MyRoom = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    
    const [room, setRoom] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const [location, setLocation] = useState('')
    const [rent, setRent] = useState('')
    const [capacity, setCapacity] = useState(1)
    const [floor, setFloor] = useState('')
    const [area, setArea] = useState('')
    const [balcony, setBalcony] = useState(false)
    const [attachedBathroom, setAttachedBathroom] = useState(false)

    const fetchMyRoom = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
            if (data.success) {
                if (data.rooms.length > 0) {
                    setRoom(data.rooms[0])
                }
            }
        } catch (error) {
            toast.error("Failed to load room details")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchMyRoom()
        }
    }, [userData])

    const handleStartEdit = () => {
        setLocation(room.location)
        setRent(room.rent)
        setCapacity(room.capacity)
        setFloor(room.floor)
        setArea(room.area)
        setBalcony(room.balcony)
        setAttachedBathroom(room.attachedBathroom)
        setIsEditing(true)
    }

    const handleCreatePrivateRoom = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/room/create', {
                location, rent, capacity, floor, area, balcony, attachedBathroom,
                status: false 
            })

            if (data.success) {
                toast.success("Private Room Created Successfully!")
                setRoom(data.room)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleUpdateRoom = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.put(backendUrl + '/api/room/' + room._id, {
                location, rent, capacity, floor, area, balcony, attachedBathroom
            })

            if (data.success) {
                toast.success("Room Updated Successfully")
                setRoom(data.room)
                setIsEditing(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteRoom = async () => {
        if(!window.confirm("Are you sure you want to delete your room? This action cannot be undone.")) return;

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.delete(backendUrl + '/api/room/' + room._id)

            if (data.success) {
                toast.success("Room Deleted Successfully")
                setRoom(null)
                setIsEditing(false)
                // Reset form
                setLocation('')
                setRent('')
                setCapacity(1)
                setFloor('')
                setArea('')
                setBalcony(false)
                setAttachedBathroom(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10 flex justify-center">
                
                {room && !isEditing ? (
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-slate-100">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h1 className="text-3xl font-bold text-slate-800">My Room Details</h1>
                            <span className={`px-4 py-1 rounded-full text-sm font-bold ${room.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {room.status ? 'Public / Posted' : 'Private / Unlisted'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-slate-500">Location</p>
                                <p className="text-lg font-semibold text-slate-800">{room.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Rent</p>
                                <p className="text-lg font-semibold text-indigo-600">৳ {room.rent}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Floor</p>
                                <p className="text-lg font-semibold text-slate-800">{room.floor}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Area</p>
                                <p className="text-lg font-semibold text-slate-800">{room.area} sq ft</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Capacity</p>
                                <p className="text-lg font-semibold text-slate-800">{room.capacity} Person(s)</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-4 mb-8">
                            {room.balcony && <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium">Balcony</span>}
                            {room.attachedBathroom && <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium">Attached Bath</span>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 border-t pt-6">
                            <button 
                                onClick={handleStartEdit}
                                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                            >
                                Edit Details
                            </button>
                            <button 
                                onClick={handleDeleteRoom}
                                className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors"
                            >
                                Delete Room
                            </button>
                        </div>
                    </div>
                ) : (
                    
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-center mb-2">
                            {isEditing ? 'Edit Room Details' : "You don't have a room yet"}
                        </h2>
                        <p className="text-center text-slate-500 mb-8">
                            {isEditing ? 'Update your room information below.' : 'Create a room to manage your space.'}
                        </p>

                        <form onSubmit={isEditing ? handleUpdateRoom : handleCreatePrivateRoom} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-slate-600 mb-1 text-sm font-medium">Location</label>
                                <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:border-indigo-500" type="text" placeholder="e.g. Uttara, Sector 4" value={location} onChange={e => setLocation(e.target.value)} required />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-600 mb-1 text-sm font-medium">Rent (BDT)</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={rent} onChange={e => setRent(e.target.value)} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-slate-600 mb-1 text-sm font-medium">Capacity</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:border-indigo-500" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-slate-600 mb-1 text-sm font-medium">Floor No.</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={floor} onChange={e => setFloor(e.target.value)} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-slate-600 mb-1 text-sm font-medium">Area (sq ft)</label>
                                    <input className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={area} onChange={e => setArea(e.target.value)} required />
                                </div>
                            </div>

                            <div className="flex gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} className="w-5 h-5 accent-indigo-500"/>
                                    <span className="text-slate-700">Balcony</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={attachedBathroom} onChange={e => setAttachedBathroom(e.target.checked)} className="w-5 h-5 accent-indigo-500"/>
                                    <span className="text-slate-700">Attached Bath</span>
                                </label>
                            </div>

                            <div className="flex gap-4 mt-4">
                                {isEditing && (
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-900 transition-all shadow-lg">
                                    {isEditing ? 'Save Changes' : 'Create Room (Private)'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyRoom