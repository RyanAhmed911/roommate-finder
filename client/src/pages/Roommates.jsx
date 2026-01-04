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

    //Added by Nusayba
    const checkRoommateCompatibility = async (roommateId) => {
        if (!userData) {
            toast.error("Please login first");
            navigate('/login');
            return;
        }

        try {
            axios.defaults.withCredentials = true;

            const { data: roomData } = await axios.get(`${backendUrl}/api/room/my-rooms`);
            if (!roomData.success || roomData.rooms.filter(r => r.status === true).length === 0) {
                toast.info("Please post your room first to check compatibility.");
                return;
            }

            const myRoom = roomData.rooms.filter(r => r.status === true)[0];

            const { data } = await axios.post(
                `${backendUrl}/api/compatibility/score`,
                { userId: roommateId, roomId: myRoom._id },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success(`Compatibility Score: ${data.compatibilityScore}%`);
            } else {
                toast.error(data.message || "Failed to calculate compatibility");
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to calculate compatibility");
        }
    };
    //Added by Nusayba


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
            // keep quiet unless needed, but still safe to show
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
                    toast.info("Request feature coming soon!")
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
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">Find Your Future Roommate</h1>
                <p className="text-center text-slate-500 mb-10">Connect with people compatible with your lifestyle.</p>
                
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-12 border border-slate-100">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="relative">
                            <input type="text" placeholder="Search by Name..." value={searchName} onChange={(e) => setSearchName(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"/>
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search by Location..." value={searchLocation} onChange={(e) => setSearchLocation(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"/>
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search by Institution..." value={searchInstitution} onChange={(e) => setSearchInstitution(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"/>
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                    </div>

                    <div className="flex justify-center mb-4">
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-8 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            {showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                        </button>
                    </div>

                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                            <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Food Habits</label>
                            <select value={filterFood} onChange={(e) => setFilterFood(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Non-Vegetarian">Non-Vegetarian</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Sleep Schedule</label>
                            <select value={filterSleep} onChange={(e) => setFilterSleep(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Early Bird">Early Bird</option>
                                <option value="Night Owl">Night Owl</option>
                                <option value="Flexible">Flexible</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Cleanliness</label>
                            <select value={filterCleanliness} onChange={(e) => setFilterCleanliness(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Neat">Neat</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Laid-back">Laid-back</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Noise Tolerance</label>
                            <select value={filterNoise} onChange={(e) => setFilterNoise(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="Low">Low</option>
                                <option value="Moderate">Moderate</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Smoking</label>
                            <select value={filterSmoker} onChange={(e) => setFilterSmoker(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="false">Non-Smoker</option>
                                <option value="true">Smoker Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Drinking</label>
                            <select value={filterDrinking} onChange={(e) => setFilterDrinking(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="false">Non-Drinker</option>
                                <option value="true">Drinker Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Visitors</label>
                            <select value={filterVisitors} onChange={(e) => setFilterVisitors(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any</option>
                                <option value="true">Allowed</option>
                                <option value="false">Not Allowed</option>
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Pets</label>
                            <select value={filterPets} onChange={(e) => setFilterPets(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
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
                        <p className="text-xl text-gray-500">No matching roommates found.</p>
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
                        }} className="mt-4 text-indigo-600 hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {users.map((user, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                
                                <div className="w-full h-72 relative bg-gray-200 group overflow-hidden">
                                    <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                                        {user.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                                <span className="text-6xl font-bold opacity-80">{user.name[0].toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                                        <span className="text-xs font-bold text-slate-500">Match</span>
                                        <span className="text-sm font-black text-green-600">85%</span>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{user.name}</h3>
                                            <p className="text-indigo-500 font-medium text-sm mt-0.5">{user.institution || 'N/A'}</p>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <button
                                                onClick={() => toggleFavoriteRoommate(user._id)}
                                                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg hover:bg-slate-200 transition-all"
                                                title={favoriteRoommateIds.has(user._id) ? "Remove from favorites" : "Add to favorites"}
                                            >
                                                {favoriteRoommateIds.has(user._id) ? '★' : '☆'}
                                            </button>

                                            {user.age && (
                                                <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold border border-slate-200">
                                                    {user.age} yo
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                            {user.gender || 'Any'}
                                        </span>
                                        
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.smoker ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {user.smoker ? 'Smoker' : 'Non-Smoker'}
                                        </span>

                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.drinking ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {user.drinking ? 'Drinker' : 'No Drink'}
                                        </span>

                                        {user.foodHabits && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-100">
                                                {user.foodHabits}
                                            </span>
                                        )}

                                        {user.cleanlinessLevel && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-100">
                                                {user.cleanlinessLevel} Clean
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1"></div>
                                       <div className="grid grid-cols-2 gap-3 mt-2">                                                                              
                                        <button onClick={() => handleSendRequest(user._id)} className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">Request</button>
                                        <button onClick={() => navigate(`/view-profile/${user._id}`)} className="py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all">View Profile</button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Roommates
