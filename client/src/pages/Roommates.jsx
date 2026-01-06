import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Navbar from '../components/Navbar'

const Roommates = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const [searchName, setSearchName] = useState('')
    const [searchLocation, setSearchLocation] = useState('')
    const [searchInstitution, setSearchInstitution] = useState('')
    
    const [filterGender, setFilterGender] = useState('')
    const [filterSmoker, setFilterSmoker] = useState('') 
    const [filterDrinking, setFilterDrinking] = useState('')
    
    const [filterFood, setFilterFood] = useState('')
    const [filterSleep, setFilterSleep] = useState('')
    const [filterCleanliness, setFilterCleanliness] = useState('')
    const [filterNoise, setFilterNoise] = useState('')
    const [filterVisitors, setFilterVisitors] = useState('')
    const [filterPets, setFilterPets] = useState('')
    const [showFilters, setShowFilters] = useState(false) 
    const [favoriteRoommateIds, setFavoriteRoommateIds] = useState(new Set())
    const [compatibilityModal, setCompatibilityModal] = useState({open: false, score: null, roommate: null});

    const checkRoommateCompatibility = async (roommateId, roommateName) => {
        if (!userData) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }

        try {
            axios.defaults.withCredentials = true;

            const { data: roomData } = await axios.get(`${backendUrl}/api/room/my-rooms`);
            const myPostedRooms = roomData.rooms.filter(r => r.status === true);
            if (!roomData.success || myPostedRooms.length === 0) {
                toast.info("Please post your room first to check compatibility.");
                return;
            }

            const myRoom = myPostedRooms[0];

            setCompatibilityModal({ open: true, score: null, roommate: { name: roommateName }, room: myRoom});

            const { data } = await axios.post(
                `${backendUrl}/api/compatibility/score`,
                { userId: roommateId, roomId: myRoom._id },
                { withCredentials: true }
            );

            if (data.success) {
                setCompatibilityModal({open: true, score: data.compatibilityScore, roommate: { name: roommateName },room: myRoom});
            } 
            else {
                toast.error(data.message || "Failed to calculate compatibility");
                setCompatibilityModal({ open: false, score: null, roommate: null, room: null });
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to calculate compatibility");
            setCompatibilityModal({ open: false, score: null, roommate: null, room: null });
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true)
            axios.defaults.withCredentials = true
            
            const params = new URLSearchParams();
            if (searchName) params.append('name', searchName);
            if (searchLocation) params.append('location', searchLocation);
            if (searchInstitution) params.append('institution', searchInstitution);
            
            if (filterGender) params.append('gender', filterGender);
            if (filterSmoker) params.append('smoker', filterSmoker);
            if (filterDrinking) params.append('drinking', filterDrinking);
            
            if (filterFood) params.append('foodHabits', filterFood);
            if (filterSleep) params.append('sleepSchedule', filterSleep);
            if (filterCleanliness) params.append('cleanlinessLevel', filterCleanliness);
            if (filterNoise) params.append('noiseTolerance', filterNoise);
            if (filterVisitors) params.append('visitors', filterVisitors);
            if (filterPets) params.append('petsAllowed', filterPets);

            const userRes = await axios.get(`${backendUrl}/api/user/all-users?${params.toString()}`)
            
            if (userRes.data.success) {
                let allUsers = userRes.data.users;
                
                if (userData) {
                    allUsers = allUsers.filter(user => 
                        user._id !== userData._id && 
                        user.name !== userData.name 
                    );
                }
                setUsers(allUsers)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchFavoriteRoommates = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(`${backendUrl}/api/favorite-roommates`)
            if (data.success) {
                const ids = new Set((data.roommates || []).map(u => u._id))
                setFavoriteRoommateIds(ids)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchUsers();
        }, 500);
        
        return () => clearTimeout(delayDebounce);
    }, [userData, searchName, searchLocation, searchInstitution, filterGender, filterSmoker, filterDrinking, filterFood, filterSleep, filterCleanliness, filterNoise, filterVisitors, filterPets])

    useEffect(() => {
        if (userData) {
            fetchFavoriteRoommates()
        } else {
            setFavoriteRoommateIds(new Set())
        }
    }, [userData])

    const handleSendRequest = async (userId) => {
        if (!userData) {
            toast.error("Please login to send a request")
            navigate('/login')
            return
        }

        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (data.success) {
                if (data.rooms.length === 0) {
                    toast.info("Please post your room details before sending requests.")
                    navigate('/post-room')
                } else {
                    const { data: inviteData } = await axios.post(backendUrl + '/api/request/send', { receiverId: userId })
                    
                    if (inviteData.success) {
                        toast.success(inviteData.message)
                    } else {
                        toast.error(inviteData.message)
                    }
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const toggleFavoriteRoommate = async (roommateId) => {
        if (!userData) {
            toast.error("Please login to add favorites")
            navigate('/login')
            return
        }

        try {
            axios.defaults.withCredentials = true
            const isFav = favoriteRoommateIds.has(roommateId)

            const endpoint = isFav
                ? `${backendUrl}/api/favorite-roommates/remove`
                : `${backendUrl}/api/favorite-roommates/add`

            const { data } = await axios.post(endpoint, { roommateID: roommateId })

            if (data.success) {
                const updated = new Set(favoriteRoommateIds)
                if (isFav) updated.delete(roommateId)
                else updated.add(roommateId)
                setFavoriteRoommateIds(updated)
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-3">Find Your Future Roommate</h1>
                    <p className="text-slate-400">Connect with people compatible with your lifestyle.</p>
                </div>
                
                <div className="max-w-6xl mx-auto bg-slate-900 rounded-2xl shadow-xl p-6 mb-12 border border-slate-700">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="relative">
                            <input type="text" placeholder="Search by Name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"/>
                            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search by Location..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"/>
                            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search by Institution..." value={searchInstitution} onChange={(e) => setSearchInstitution(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:border-indigo-500 outline-none transition-all placeholder-slate-500"/>
                            <svg className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                    </div>

                    <div className="flex justify-center mb-4">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 text-sm ${showFilters ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            {showFilters ? 'Hide Filters' : 'More Filters'}
                        </button>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Gender</label>
                            <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Food Habits</label>
                            <select value={filterFood} onChange={(e) => setFilterFood(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                                <option value="Vegetarian">Vegetarian</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Sleep Schedule</label>
                            <select value={filterSleep} onChange={(e) => setFilterSleep(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Early Bird">Early Bird</option>
                                <option value="Night Owl">Night Owl</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Cleanliness</label>
                            <select value={filterCleanliness} onChange={(e) => setFilterCleanliness(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Noise Tolerance</label>
                            <select value={filterNoise} onChange={(e) => setFilterNoise(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Smoking</label>
                            <select value={filterSmoker} onChange={(e) => setFilterSmoker(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="false">Non-Smoker</option>
                                <option value="true">Smoker Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Drinking</label>
                            <select value={filterDrinking} onChange={(e) => setFilterDrinking(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="false">Non-Drinker</option>
                                <option value="true">Drinker Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Visitors</label>
                            <select value={filterVisitors} onChange={(e) => setFilterVisitors(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="true">Allowed</option>
                                <option value="false">Not Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-400 uppercase">Pets</label>
                            <select value={filterPets} onChange={(e) => setFilterPets(e.target.value)} className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="true">Allowed</option>
                                <option value="false">Not Allowed</option>
                            </select>
                        </div>

                    </div>
                </div>

                {loading ? (
                     <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-slate-400">No matching roommates found.</p>
                        <button onClick={() => {
                            setSearchName('')
                            setSearchLocation('')
                            setSearchInstitution('')
                            setFilterGender('')
                            setFilterSmoker('')
                            setFilterDrinking('')
                            setFilterFood('')
                            setFilterSleep('')
                            setFilterCleanliness('')
                            setFilterNoise('')
                            setFilterVisitors('')
                            setFilterPets('')
                        }} className="mt-4 text-indigo-400 hover:text-indigo-300">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {users.map((user, index) => (
                            <div key={index} className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-700 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full group">
                                
                                <div className="w-full h-72 relative bg-slate-800 group overflow-hidden">
                                    <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-600">
                                                <span className="text-6xl font-bold opacity-50">{user.name[0].toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="absolute top-4 right-4 z-10">
                                        <button
                                            onClick={() => checkRoommateCompatibility(user._id, user.name)}
                                            className="bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1 border border-purple-500/30
                                                    hover:bg-purple-900/50 hover:scale-105 hover:shadow-xl transition-all duration-300"
                                        >
                                            <span className="text-xs font-bold text-purple-400">Check Compatibility</span>
                                        </button>                        
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white leading-tight">{user.name}</h3>
                                            <p className="text-indigo-400 font-medium text-sm mt-0.5">{user.institution || 'N/A'}</p>
                                        </div>
                                        
                                        <div className="flex items-start gap-2">
                                            {user.age && (
                                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-2 rounded-full font-bold border border-slate-700">
                                                    {user.age} yo
                                                </span>
                                            )}
                                            <button 
                                                onClick={() => toggleFavoriteRoommate(user._id)}
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${favoriteRoommateIds.has(user._id) ? 'bg-pink-500/10 text-pink-500' : 'bg-slate-800 text-slate-500 hover:text-white'}`}
                                            >
                                                <svg className={`w-4 h-4 ${favoriteRoommateIds.has(user._id) ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-900/30 text-blue-400 border border-blue-800">
                                            {user.gender || 'Any'}
                                        </span>
                                        
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.smoker ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-green-900/30 text-green-400 border-green-800'}`}>
                                            {user.smoker ? 'Smoker' : 'Non-Smoker'}
                                        </span>

                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.drinking ? 'bg-purple-900/30 text-purple-400 border-purple-800' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                            {user.drinking ? 'Drinker' : 'No Drink'}
                                        </span>

                                        {user.foodHabits && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-orange-900/30 text-orange-400 border border-orange-800">
                                                {user.foodHabits}
                                            </span>
                                        )}

                                    </div>
                                    
                                    <div className="flex-1"></div>
                                       <div className="grid grid-cols-2 gap-3 mt-2">                                                                              
                                        <button onClick={() => handleSendRequest(user._id)} className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">Send Request</button>
                                        <button onClick={() => navigate(`/view-profile/${user._id}`)} className="py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm hover:bg-slate-700 hover:text-white transition-all">View Profile</button>
                                    </div>

                                </div>
                            </div>
                        ))}

                        {compatibilityModal.open && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                            <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-700 overflow-hidden">
                            
                            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex justify-between items-start text-white">
                                <h2 className="text-xl font-bold">Compatibility Score</h2>
                                <button
                                onClick={() => setCompatibilityModal({ open: false, score: null, roommate: null, room: null })}
                                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                                >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                </button>
                            </div>

                           
                            <div className="p-8 text-center">
                                <p className="text-slate-400 mb-4 text-sm">
                                Room: <span className="font-semibold text-white">{compatibilityModal.room?.location || 'Your Room'}</span>
                                </p>

                                {compatibilityModal.score === null ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-slate-400 text-sm">Processing...</p>
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
                                onClick={() => setCompatibilityModal({ open: false, score: null, roommate: null, room: null })}
                                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors border border-slate-700"
                                >
                                Close
                                </button>
                            </div>
                            </div>
                        </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    )
}

export default Roommates