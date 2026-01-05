import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

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
    
    const [roomType, setRoomType] = useState('Shared')
    const [furnishingStatus, setFurnishingStatus] = useState('Unfurnished')
    const [wifi, setWifi] = useState(false)
    const [refrigerator, setRefrigerator] = useState(false)
    const [kitchenAccess, setKitchenAccess] = useState(false)
    const [parking, setParking] = useState(false)
    const [elevator, setElevator] = useState(false)
    const [generator, setGenerator] = useState(false)
    const [securityGuard, setSecurityGuard] = useState(false)

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

    const isOwner = room && userData && room.users?.length > 0 && (String(room.users[0]._id) === String(userData._id));

    const handleEditClick = () => {
        setLocation(room.location)
        setRent(room.rent)
        setCapacity(room.capacity)
        setFloor(room.floor)
        setArea(room.area)
        setBalcony(room.balcony)
        setAttachedBathroom(room.attachedBathroom)
        setRoomType(room.roomType || 'Shared')
        setFurnishingStatus(room.furnishingStatus || 'Unfurnished')
        setWifi(room.wifi || false)
        setRefrigerator(room.refrigerator || false)
        setKitchenAccess(room.kitchenAccess || false)
        setParking(room.parking || false)
        setElevator(room.elevator || false)
        setGenerator(room.generator || false)
        setSecurityGuard(room.securityGuard || false)
        setIsEditing(true)
    }

    const handleUpdateRoom = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.put(backendUrl + '/api/room/' + room._id, {
                location, rent, capacity, floor, area, balcony, attachedBathroom,
                roomType, furnishingStatus, wifi, refrigerator, kitchenAccess, parking, elevator, generator, securityGuard
            })

            if (data.success) {
                toast.success("Room Updated Successfully")
                fetchMyRoom()
                setIsEditing(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDeleteRoom = async () => {
        if (!window.confirm("Are you sure? This will delete the room and remove all roommates.")) return;

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.delete(backendUrl + '/api/room/' + room._id)

            if (data.success) {
                toast.success("Room Deleted")
                setRoom(null)
                setIsEditing(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleLeaveRoom = async () => {
        if (!window.confirm("Are you sure you want to leave this room?")) return;

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + `/api/room/${room._id}/leave`)

            if (data.success) {
                toast.success("You left the room")
                setRoom(null)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleRemoveUser = async (userId) => {
        if (!window.confirm("Remove this user from the room?")) return;

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/room/remove-user', { 
                roomId: room._id, 
                userIdToRemove: userId 
            })

            if (data.success) {
                toast.success("User removed")
                fetchMyRoom() 
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleCreatePrivateRoom = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/room/create', {
                location, rent, capacity, floor, area, balcony, attachedBathroom,
                roomType, furnishingStatus, wifi, refrigerator, kitchenAccess, parking, elevator, generator, securityGuard,
                status: false
            })

            if (data.success) {
                toast.success("Private Room Created!")
                fetchMyRoom()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userData) fetchMyRoom()
    }, [userData])

    const AmenityCheckbox = ({ label, checked, setChecked }) => (
        <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} className="w-4 h-4 accent-indigo-500"/>
            <span className="text-sm text-slate-300">{label}</span>
        </label>
    );

    if (loading) return <div className="min-h-screen bg-[#08101C] flex items-center justify-center text-white">Loading...</div>

    return (
        <div className="min-h-screen bg-[#08101C] pt-20">
            <Navbar />
            
            <div className="container mx-auto px-4 py-10">
                {!room ? (
                    <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-700">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white">No Room Found</h2>
                            <p className="text-slate-400">Create a private room to manage your space.</p>
                        </div>

                        <form onSubmit={handleCreatePrivateRoom} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-slate-400 mb-1.5 text-sm font-medium">Location</label>
                                <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="text" placeholder="e.g. Uttara, Sector 4" value={location} onChange={e => setLocation(e.target.value)} required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Rent (BDT)</label>
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={rent} onChange={e => setRent(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Capacity</label>
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Floor No.</label>
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={floor} onChange={e => setFloor(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Area (sq ft)</label>
                                    <input className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" type="number" value={area} onChange={e => setArea(e.target.value)} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Room Type</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" value={roomType} onChange={e => setRoomType(e.target.value)}>
                                        <option value="Shared">Shared</option>
                                        <option value="Single">Single</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 mb-1.5 text-sm font-medium">Furnishing</label>
                                    <select className="w-full bg-slate-800 border border-slate-700 text-white p-3 rounded-lg outline-none focus:border-indigo-500" value={furnishingStatus} onChange={e => setFurnishingStatus(e.target.value)}>
                                        <option value="Unfurnished">Unfurnished</option>
                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                        <option value="Furnished">Furnished</option>
                                    </select>
                                </div>
                            </div>

                            <label className="block text-slate-400 text-sm font-medium">Amenities & Features</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <AmenityCheckbox label="Balcony" checked={balcony} setChecked={setBalcony} />
                                <AmenityCheckbox label="Attached Bath" checked={attachedBathroom} setChecked={setAttachedBathroom} />
                                <AmenityCheckbox label="WiFi" checked={wifi} setChecked={setWifi} />
                                <AmenityCheckbox label="Refrigerator" checked={refrigerator} setChecked={setRefrigerator} />
                                <AmenityCheckbox label="Kitchen" checked={kitchenAccess} setChecked={setKitchenAccess} />
                                <AmenityCheckbox label="Parking" checked={parking} setChecked={setParking} />
                                <AmenityCheckbox label="Elevator" checked={elevator} setChecked={setElevator} />
                                <AmenityCheckbox label="Generator" checked={generator} setChecked={setGenerator} />
                                <AmenityCheckbox label="Guard" checked={securityGuard} setChecked={setSecurityGuard} />
                            </div>

                            <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold mt-4 hover:bg-indigo-700 transition-all shadow-lg">
                                Create Room (Private)
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-white">My Room Dashboard</h1>
                                <p className="text-slate-400">Manage your shared living space</p>
                            </div>
                            <div className="flex gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${room.status ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-amber-900/30 text-amber-400 border-amber-800'}`}>
                                    {room.status ? 'Looking for Roommates' : 'Room Full / Private'}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            <div className="lg:col-span-2 flex flex-col gap-6">
                                
                                <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                            Apartment Details
                                        </h2>
                                        {isOwner && !isEditing && (
                                            <button onClick={handleEditClick} className="bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                                                Edit Details
                                            </button>
                                        )}
                                    </div>

                                    {!isEditing ? (
                                        <div className="flex flex-col gap-6">
                                            {/* Redesigned Details Section */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                                <div className="flex flex-col gap-1 pb-4 border-b border-slate-800 sm:border-0">
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Location</span>
                                                    <div className="text-lg font-medium text-white flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                        {room.location}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex flex-col gap-1 pb-4 border-b border-slate-800 sm:border-0">
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Rent</span>
                                                    <div className="text-2xl font-bold text-indigo-400">
                                                        ৳ {room.rent} <span className="text-sm font-normal text-slate-500">/ month</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Specifications</span>
                                                    <div className="flex items-center gap-4 text-white">
                                                        <span className="bg-slate-800 px-3 py-1 rounded-md text-sm">{room.area} sq ft</span>
                                                        <span className="bg-slate-800 px-3 py-1 rounded-md text-sm">{room.roomType || 'Shared'}</span>
                                                        <span className="bg-slate-800 px-3 py-1 rounded-md text-sm">{room.floor}{getOrdinal(room.floor)} Floor</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-1">
                                                     <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Furnishing</span>
                                                     <div className="text-white font-medium">{room.furnishingStatus || 'Unfurnished'}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="pt-4 border-t border-slate-800">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-3">Amenities</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {room.balcony && <Badge label="Balcony" color="blue" />}
                                                    {room.attachedBathroom && <Badge label="Attached Bath" color="purple" />}
                                                    {room.wifi && <Badge label="WiFi" color="indigo" />}
                                                    {room.refrigerator && <Badge label="Fridge" color="teal" />}
                                                    {room.kitchenAccess && <Badge label="Kitchen" color="orange" />}
                                                    {room.parking && <Badge label="Parking" color="gray" />}
                                                    {room.elevator && <Badge label="Elevator" color="yellow" />}
                                                    {room.generator && <Badge label="Generator" color="red" />}
                                                    {room.securityGuard && <Badge label="Guard" color="green" />}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleUpdateRoom} className="flex flex-col gap-4 animate-fadeIn">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <input className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
                                                <input className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" type="number" placeholder="Rent" value={rent} onChange={e => setRent(e.target.value)} required />
                                                <input className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" type="number" placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                                                <input className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" type="number" placeholder="Floor" value={floor} onChange={e => setFloor(e.target.value)} required />
                                                <input className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" type="number" placeholder="Area" value={area} onChange={e => setArea(e.target.value)} required />
                                                <select className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" value={roomType} onChange={e => setRoomType(e.target.value)}>
                                                    <option value="Shared">Shared</option>
                                                    <option value="Single">Single</option>
                                                </select>
                                                <select className="p-3 bg-slate-800 border border-slate-700 rounded-lg text-white" value={furnishingStatus} onChange={e => setFurnishingStatus(e.target.value)}>
                                                    <option value="Unfurnished">Unfurnished</option>
                                                    <option value="Semi-Furnished">Semi-Furnished</option>
                                                    <option value="Furnished">Furnished</option>
                                                </select>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                <AmenityCheckbox label="Balcony" checked={balcony} setChecked={setBalcony} />
                                                <AmenityCheckbox label="Bath" checked={attachedBathroom} setChecked={setAttachedBathroom} />
                                                <AmenityCheckbox label="WiFi" checked={wifi} setChecked={setWifi} />
                                                <AmenityCheckbox label="Fridge" checked={refrigerator} setChecked={setRefrigerator} />
                                                <AmenityCheckbox label="Kitchen" checked={kitchenAccess} setChecked={setKitchenAccess} />
                                                <AmenityCheckbox label="Parking" checked={parking} setChecked={setParking} />
                                                <AmenityCheckbox label="Elevator" checked={elevator} setChecked={setElevator} />
                                                <AmenityCheckbox label="Generator" checked={generator} setChecked={setGenerator} />
                                                <AmenityCheckbox label="Guard" checked={securityGuard} setChecked={setSecurityGuard} />
                                            </div>

                                            <div className="flex gap-3 mt-2">
                                                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-lg font-bold hover:bg-slate-700">Cancel</button>
                                                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save</button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6">
                                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        Roommates ({room.users.length})
                                    </h2>
                                    
                                    <div className="space-y-3">
                                        {room.users.map((user) => (
                                            <div key={user._id} className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-sm">
                                                        {user.image ? (
                                                            <img src={user.image} className="w-full h-full object-cover" alt={user.name} />
                                                        ) : (
                                                            <span className="font-bold text-indigo-400">{user.name ? user.name[0] : '?'}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{user.name} {userData._id === user._id && <span className="text-xs text-slate-500 font-normal">(You)</span>}</p>
                                                        <p className="text-xs text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded-full border border-green-900/50">
                                                        Active
                                                    </span>
                                                    {isOwner && String(user._id) !== String(userData._id) && (
                                                        <button 
                                                            onClick={() => handleRemoveUser(user._id)}
                                                            className="p-1.5 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-900/40 transition-colors"
                                                            title="Remove User"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-700 p-6">
                                    <h3 className="text-lg font-bold text-white mb-4">Room Tools</h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        
                                        <button 
                                            onClick={() => navigate('/room/expenses')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/20 text-slate-300 hover:text-indigo-400 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm">Expenses</p>
                                                <p className="text-xs opacity-50">Track bills & splitting</p>
                                            </div>
                                        </button>
                                        
                                        <button 
                                            onClick={() => navigate('/room/chores')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/20 text-slate-300 hover:text-indigo-400 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm">Chores</p>
                                                <p className="text-xs opacity-50">Task rotation & schedule</p>
                                            </div>
                                        </button>

                                        <button 
                                            onClick={() => navigate('/room/groupchat')}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 hover:bg-indigo-900/20 text-slate-300 hover:text-indigo-400 transition-colors group">
                                            <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform text-white">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                            </div>
                                            <div className="text-left">
                                                <p className="font-bold text-sm">Group Chat</p>
                                                <p className="text-xs opacity-50">Message roommates</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-900 rounded-2xl shadow-sm border border-red-900/30 p-6">
                                    {isOwner ? (
                                        <button onClick={handleDeleteRoom} className="w-full py-2.5 bg-red-900/20 text-red-500 rounded-lg font-bold border border-red-900/50 hover:bg-red-600 hover:text-white transition-colors">
                                            Delete Room
                                        </button>
                                    ) : (
                                        <button onClick={handleLeaveRoom} className="w-full py-2.5 bg-red-900/20 text-red-500 rounded-lg font-bold border border-red-900/50 hover:bg-red-600 hover:text-white transition-colors">
                                            Leave Room
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Helper to display badges
const Badge = ({ label, color }) => {
    const colors = {
        blue: "bg-blue-900/30 text-blue-400 border-blue-800",
        purple: "bg-purple-900/30 text-purple-400 border-purple-800",
        indigo: "bg-indigo-900/30 text-indigo-400 border-indigo-800",
        teal: "bg-teal-900/30 text-teal-400 border-teal-800",
        orange: "bg-orange-900/30 text-orange-400 border-orange-800",
        gray: "bg-gray-800 text-gray-400 border-gray-700",
        yellow: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
        red: "bg-red-900/30 text-red-400 border-red-800",
        green: "bg-green-900/30 text-green-400 border-green-800",
    }
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[color] || colors.gray}`}>
            {label}
        </span>
    )
}

const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
}

export default MyRoom