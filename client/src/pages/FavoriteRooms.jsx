// Created by Prachurzo
// Updated: Added Check Compatibility feature, matched dark theme styling

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
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [favoriteRoomIds, setFavoriteRoomIds] = useState(new Set())
  
  // Added: Compatibility State
  const [compatibilityModal, setCompatibilityModal] = useState({ open: false, score: null, room: null });

  const fetchFavouriteRooms = async () => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.get(`${backendUrl}/api/favorites`)

      if (data.success) {
        const list = data.rooms || []
        setRooms(list)

        const ids = list
          .map(r => (typeof r === 'string' ? r : r?._id))
          .filter(Boolean)

        setFavoriteRoomIds(new Set(ids))
      } else {
        setRooms([])
        setFavoriteRoomIds(new Set())
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

  const handleJoinRequest = async (roomId) => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(`${backendUrl}/api/request/join`, { roomId })
      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const removeFavorite = async (roomId) => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(`${backendUrl}/api/favorites/remove`, { roomID: roomId })
      if (data.success) {
        toast.success("Removed from favorites")
        fetchFavouriteRooms()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Added: Check Compatibility Function
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
          <h1 className="text-4xl font-bold text-white mb-3">Favorite Rooms</h1>
          <p className="text-slate-400">Spaces you have saved for later.</p>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏠</div>
            <p className="text-xl text-slate-400">No favorite rooms yet.</p>
            <button onClick={() => navigate('/rooms')} className="mt-4 text-indigo-400 hover:text-indigo-300">Browse Rooms</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => {
               if (!room) return null
               const owner = room.users && room.users.length > 0 ? room.users[0] : null;

               return (
                <div key={room._id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col">
                  {/* Image / Placeholder */}
                  <div className="h-48 bg-slate-800 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-gradient-to-br from-slate-800 to-slate-900">
                          <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                          <span className="text-sm font-bold tracking-wider opacity-50">NO IMAGE</span>
                      </div>
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
                              <p className="text-slate-400 text-xs">{room.area} sq ft • {room.floor}th Floor</p>
                          </div>
                          
                          {/* Remove Favorite Button */}
                          <button 
                              onClick={() => removeFavorite(room._id)}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors bg-pink-500/10 text-pink-500 hover:bg-pink-500/20"
                              title="Remove from favorites"
                          >
                              <svg className="w-4 h-4 fill-current" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                          </button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                          {room.balcony && <span className="text-[10px] bg-blue-900/30 text-blue-400 border border-blue-800 px-2 py-1 rounded">Balcony</span>}
                          {room.attachedBathroom && <span className="text-[10px] bg-purple-900/30 text-purple-400 border border-purple-800 px-2 py-1 rounded">Bath</span>}
                          {room.wifi && <span className="text-[10px] bg-indigo-900/30 text-indigo-400 border border-indigo-800 px-2 py-1 rounded">WiFi</span>}
                          {room.generator && <span className="text-[10px] bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded">Generator</span>}
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
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
                            {/* Compatibility Button */}
                            <button 
                                onClick={() => checkCompatibility(room)}
                                className="px-3 py-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-bold rounded-lg transition-colors border border-purple-600/20">
                                Check Compatibility
                            </button>
                            
                            {/* Details Button */}
                            <button 
                                onClick={() => setSelectedRoom(room)}
                                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-lg transition-colors border border-slate-600"
                            >
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
      </div>

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
      {selectedRoom && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-700 overflow-hidden relative max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-800 flex justify-between items-start bg-slate-800/50">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{selectedRoom.location}</h2>
                        <div className="flex items-center gap-3 mt-1 text-slate-400 text-sm">
                            <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">{selectedRoom.roomType || 'Shared'}</span>
                            <span>{selectedRoom.area} sq ft</span>
                            <span>•</span>
                            <span>{selectedRoom.floor}th Floor</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setSelectedRoom(null)}
                        className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Financials</h3>
                                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-slate-300">Monthly Rent</span>
                                        <span className="text-xl font-bold text-white">৳ {selectedRoom.rent}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">Capacity</span>
                                        <span className="text-white">{selectedRoom.capacity} Person(s)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Roommates</h3>
                                <div className="flex flex-col gap-2">
                                    {selectedRoom.users && selectedRoom.users.length > 0 ? (
                                        selectedRoom.users.map(user => (
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

                        <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Amenities & Features</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedRoom.balcony && <Badge label="Balcony" color="blue" />}
                                {selectedRoom.attachedBathroom && <Badge label="Attached Bath" color="purple" />}
                                {selectedRoom.wifi && <Badge label="WiFi" color="indigo" />}
                                {selectedRoom.refrigerator && <Badge label="Refrigerator" color="teal" />}
                                {selectedRoom.kitchenAccess && <Badge label="Kitchen Access" color="orange" />}
                                {selectedRoom.parking && <Badge label="Parking" color="gray" />}
                                {selectedRoom.elevator && <Badge label="Elevator" color="yellow" />}
                                {selectedRoom.generator && <Badge label="Generator" color="red" />}
                                {selectedRoom.securityGuard && <Badge label="Security Guard" color="green" />}
                                {!selectedRoom.balcony && !selectedRoom.attachedBathroom && !selectedRoom.wifi && (
                                    <span className="text-slate-500 text-sm italic">No specific amenities listed.</span>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Preferences</h3>
                                <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Furnishing</span>
                                        <span className="text-white">{selectedRoom.furnishingStatus || 'Unfurnished'}</span>
                                    </div>
                                    {selectedRoom.smoker !== undefined && (
                                        <div className="flex justify-between">
                                            <span className="text-slate-400">Smoking</span>
                                            <span className={selectedRoom.smoker ? "text-green-400" : "text-red-400"}>{selectedRoom.smoker ? "Allowed" : "Not Allowed"}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-800 bg-slate-900 flex gap-4">
                    <button 
                        onClick={() => handleJoinRequest(selectedRoom._id)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
                    >
                        Send Request
                    </button>
                    
                </div>
            </div>
        </div>
      )}
    </div>
  )
}

export default FavouriteRooms