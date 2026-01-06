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
    const [compatibilityModal, setCompatibilityModal] = useState({ open: false, score: null, room: null });
    const [detailsModal, setDetailsModal] = useState({ open: false, room: null });

    // Search & Filter States
    const [searchLocation, setSearchLocation] = useState('')
    const [minRent, setMinRent] = useState('')
    const [maxRent, setMaxRent] = useState('')
    const [filterBalcony, setFilterBalcony] = useState(false)
    const [filterAttachedBath, setFilterAttachedBath] = useState(false)
    const [showFilters, setShowFilters] = useState(false)

    const fetchRooms = async () => {
        try {
            axios.defaults.withCredentials = true
            
            const params = new URLSearchParams()
            if (searchLocation) params.append('location', searchLocation)
            if (minRent) params.append('minRent', minRent)
            if (maxRent) params.append('maxRent', maxRent)
            if (filterBalcony) params.append('balcony', 'true')
            if (filterAttachedBath) params.append('attachedBathroom', 'true')

            const endpoint = (searchLocation || minRent || maxRent || filterBalcony || filterAttachedBath)
                ? '/api/room/search'
                : '/api/room/available'

            const { data } = await axios.get(`${backendUrl}${endpoint}?${params.toString()}`)
            
            if (data.success) {
                let allRooms = data.rooms
                if (userData) {
                    allRooms = allRooms.filter(room => 
                        !room.users.some(user => String(user._id) === String(userData._id))
                    )
                }
                setRooms(allRooms)
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
                const ids = (data.rooms || []).map(r => (typeof r === 'object' ? r._id : r))
                setFavoriteRoomIds(new Set(ids))
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchRooms()
        }, 500)
        return () => clearTimeout(debounce)
    }, [searchLocation, minRent, maxRent, filterBalcony, filterAttachedBath])

    useEffect(() => {
        fetchFavoriteRooms()
    }, [userData])

    const handleSendRequest = async (roomId) => {
        if (!userData) {
            toast.error("Please login to send a request")
            navigate('/login')
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

    const toggleFavorite = async (roomId) => {
        if (!userData) {
            toast.error("Please login to add favorites")
            navigate('/login')
            return
        }

        try {
            axios.defaults.withCredentials = true
            const isFav = favoriteRoomIds.has(roomId)
            
            const endpoint = isFav 
                ? `${backendUrl}/api/favorites/remove`
                : `${backendUrl}/api/favorites/add`

            const { data } = await axios.post(endpoint, { roomID: roomId })

            if (data.success) {
                const newSet = new Set(favoriteRoomIds)
                if (isFav) newSet.delete(roomId)
                else newSet.add(roomId)
                setFavoriteRoomIds(newSet)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const checkCompatibility = async (room) => {
        if (!userData) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }

        if (!room.users || room.users.length === 0) {
            toast.info("Cannot check compatibility (No owner data).");
            return;
        }

        const ownerId = room.users[0]._id;

        try {
            setCompatibilityModal({ open: true, score: null, room });
            axios.defaults.withCredentials = true;
            
            const { data } = await axios.post(
                `${backendUrl}/api/compatibility/score`,
                { userId: ownerId, roomId: room._id }
            );

            if (data.success) {
                setCompatibilityModal({ open: true, score: data.compatibilityScore, room });
            } else {
                toast.error(data.message || "Failed to calculate");
                setCompatibilityModal({ open: false, score: null, room: null });
            }
        } catch (error) {
            toast.error("Failed to calculate compatibility");
            setCompatibilityModal({ open: false, score: null, room: null });
        }
    };

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

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">Find Your Perfect Room</h1>
                    <p className="text-slate-400">Discover available spaces that match your lifestyle</p>
                </div>

                {/* Search & Filters Section */}
                <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl shadow-xl p-6 mb-12 border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search by Location..." 
                                value={searchLocation} 
                                onChange={(e) => setSearchLocation(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                            />
                            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Min Rent" 
                                value={minRent} 
                                onChange={(e) => setMinRent(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                            />
                            <span className="absolute left-4 top-3 text-slate-500 font-bold">৳</span>
                        </div>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="Max Rent" 
                                value={maxRent} 
                                onChange={(e) => setMaxRent(e.target.value)} 
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"
                            />
                            <span className="absolute left-4 top-3 text-slate-500 font-bold">৳</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${showFilters ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            {showFilters ? 'Hide Filters' : 'More Filters'}
                        </button>

                        <div className={`overflow-hidden transition-all duration-300 w-full ${showFilters ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                            <div className="flex justify-center gap-6">
                                <label className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                    <input type="checkbox" checked={filterBalcony} onChange={e => setFilterBalcony(e.target.checked)} className="w-4 h-4 accent-indigo-500"/>
                                    <span className="text-slate-300 text-sm">Balcony</span>
                                </label>
                                <label className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-lg cursor-pointer border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                    <input type="checkbox" checked={filterAttachedBath} onChange={e => setFilterAttachedBath(e.target.checked)} className="w-4 h-4 accent-indigo-500"/>
                                    <span className="text-slate-300 text-sm">Attached Bath</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Room Grid */}
                {rooms.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-slate-400">No rooms found matching your criteria.</p>
                        <button onClick={() => { setSearchLocation(''); setMinRent(''); setMaxRent(''); setFilterBalcony(false); setFilterAttachedBath(false); }} className="mt-4 text-indigo-400 hover:text-indigo-300">Clear all filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map((room) => {
                            const owner = room.users && room.users.length > 0 ? room.users[0] : null;

                            return (
                                <div key={room._id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col">
                                    {/* Image / Placeholder */}
                                    <div className="h-48 bg-slate-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                                        {room.image ? (
                                            <img src={room.image} alt={room.location} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-gradient-to-br from-slate-800 to-slate-900">
                                                <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                                <span className="text-sm font-bold tracking-wider opacity-50">NO IMAGE</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <span className="bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                                                {room.roomType || 'Shared'}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                                ৳ {room.rent}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-white leading-tight mb-1">{room.location}</h3>
                                                <p className="text-slate-400 text-xs">{room.area} sq ft • Floor {room.floor}</p>
                                            </div>
                                            
                                            {/* Favorite Button */}
                                            <button 
                                                onClick={() => toggleFavorite(room._id)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${favoriteRoomIds.has(room._id) ? 'bg-pink-500/10 text-pink-500' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                                            >
                                                <svg className={`w-4 h-4 ${favoriteRoomIds.has(room._id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {room.balcony && <span className="text-[10px] bg-blue-900/30 text-blue-400 border border-blue-800 px-2 py-1 rounded">Balcony</span>}
                                            {room.attachedBathroom && <span className="text-[10px] bg-purple-900/30 text-purple-400 border border-purple-800 px-2 py-1 rounded">Attached Bath</span>}
                                            {room.wifi && <span className="text-[10px] bg-indigo-900/30 text-indigo-400 border border-indigo-800 px-2 py-1 rounded">WiFi</span>}
                                            {room.generator && <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded">Generator</span>}
                                        </div>

                                        <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
                                            {/* User Info with Profile Picture */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-slate-600">
                                                    {owner && owner.image ? (
                                                        <img src={owner.image} alt={owner.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                                                            {owner ? owner.name[0].toUpperCase() : '?'}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-white">{owner ? owner.name.split(' ')[0] : 'Unknown'}</span>
                                                    <span className="text-[10px] text-slate-500">Owner</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => checkCompatibility(room)}
                                                    className="px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-bold rounded-lg transition-colors border border-purple-600/20">
                                                    Check Compatibility
                                                </button>
                                                <button 
                                                    onClick={() => setDetailsModal({open: true, room: room})}
                                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Compatibility Modal */}
                {compatibilityModal.open && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
                                <h3 className="text-xl font-bold text-white">Compatibility Score</h3>
                                <p className="text-indigo-100 text-sm opacity-80">With {compatibilityModal.room?.location}</p>
                            </div>
                            
                            <div className="p-8 text-center">
                                {compatibilityModal.score === null ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-slate-400 text-sm">Analyzing compatibility...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 animate-scaleIn">
                                        <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                                            {compatibilityModal.score}%
                                        </span>
                                        <p className="text-slate-400 text-sm">Match Probability</p>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setCompatibilityModal({ open: false, score: null, room: null })}
                                    className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors border border-slate-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* View Details Modal */}
                {detailsModal.open && detailsModal.room && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700 overflow-hidden relative max-h-[90vh] flex flex-col">
                            {/* Room Image Header */}
                            {detailsModal.room.image && (
                                <div className="h-64 w-full overflow-hidden">
                                    <img src={detailsModal.room.image} alt={detailsModal.room.location} className="w-full h-full object-cover" />
                                </div>
                            )}

                            {/* Header */}
                            <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{detailsModal.room.location}</h2>
                                    <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{detailsModal.room.roomType || 'Shared'}</span>
                                        <span>{detailsModal.room.area} sq ft</span>
                                        <span>•</span>
                                        <span>{detailsModal.room.floor}th Floor</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setDetailsModal({ open: false, room: null })}
                                    className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto" style={{scrollbarWidth: 'thin',scrollbarColor: '#5c3f91 #1e1b2b'}}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column */}
                                    <div className="flex flex-col gap-6">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Financials</h3>
                                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-slate-300">Monthly Rent</span>
                                                    <span className="text-xl font-bold text-white">৳ {detailsModal.room.rent}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400">Capacity</span>
                                                    <span className="text-white">{detailsModal.room.capacity} Person(s)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Roommates</h3>
                                            <div className="flex flex-col gap-2">
                                                {detailsModal.room.users && detailsModal.room.users.length > 0 ? (
                                                    detailsModal.room.users.map(user => (
                                                        <div key={user._id} className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600">
                                                                {user.image ? (
                                                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-sm font-bold text-slate-400">{user.name[0]}</span>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-white text-sm">{user.name}</p>
                                                                <p className="text-xs text-slate-500">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-slate-500 text-sm">No roommates yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Amenities & Features</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {detailsModal.room.balcony && <Badge label="Balcony" color="blue" />}
                                            {detailsModal.room.attachedBathroom && <Badge label="Attached Bath" color="purple" />}
                                            {detailsModal.room.wifi && <Badge label="WiFi" color="indigo" />}
                                            {detailsModal.room.refrigerator && <Badge label="Refrigerator" color="teal" />}
                                            {detailsModal.room.kitchenAccess && <Badge label="Kitchen Access" color="orange" />}
                                            {detailsModal.room.parking && <Badge label="Parking" color="gray" />}
                                            {detailsModal.room.elevator && <Badge label="Elevator" color="yellow" />}
                                            {detailsModal.room.generator && <Badge label="Generator" color="red" />}
                                            {detailsModal.room.securityGuard && <Badge label="Security Guard" color="green" />}
                                            {!detailsModal.room.balcony && !detailsModal.room.attachedBathroom && !detailsModal.room.wifi && (
                                                <span className="text-slate-500 text-sm italic">No specific amenities listed.</span>
                                            )}
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Preferences</h3>
                                            <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Furnishing</span>
                                                    <span className="text-white">{detailsModal.room.furnishingStatus || 'Unfurnished'}</span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Smoking</span>
                                                    <span className={detailsModal.room.smoker ? "text-green-400" : "text-red-400"}>
                                                        {detailsModal.room.smoker ? "Allowed" : "Not Allowed"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Drinking</span>
                                                    <span className={detailsModal.room.drinking ? "text-green-400" : "text-red-400"}>
                                                        {detailsModal.room.drinking ? "Allowed" : "Not Allowed"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Visitors</span>
                                                    <span className={detailsModal.room.visitors ? "text-green-400" : "text-red-400"}>
                                                        {detailsModal.room.visitors ? "Allowed" : "Not Allowed"}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Pets Allowed</span>
                                                    <span className={detailsModal.room.petsAllowed ? "text-green-400" : "text-red-400"}>
                                                        {detailsModal.room.petsAllowed ? "Yes" : "No"}
                                                    </span>
                                                </div>

                                                {detailsModal.room.personalityType && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Personality Type</span>
                                                        <span className="text-white">{detailsModal.room.personalityType}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.hobbies && detailsModal.room.hobbies.length > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Hobbies</span>
                                                        <span className="text-white">{detailsModal.room.hobbies.join(', ')}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.foodHabits && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Food Habits</span>
                                                        <span className="text-white">{detailsModal.room.foodHabits}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.sleepSchedule && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Sleep Schedule</span>
                                                        <span className="text-white">{detailsModal.room.sleepSchedule}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.cleanlinessLevel && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Cleanliness Level</span>
                                                        <span className="text-white">{detailsModal.room.cleanlinessLevel}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.noiseTolerance && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Noise Tolerance</span>
                                                        <span className="text-white">{detailsModal.room.noiseTolerance}</span>
                                                    </div>
                                                )}

                                                {detailsModal.room.medicalConditions && detailsModal.room.medicalConditions.length > 0 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Medical Conditions</span>
                                                        <span className="text-white">{detailsModal.room.medicalConditions.join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-800 bg-slate-900 flex gap-4">
                                <button 
                                    onClick={() => handleSendRequest(detailsModal.room._id)}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    Send Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Rooms