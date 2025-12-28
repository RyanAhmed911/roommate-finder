import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets' 

const Roommates = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    const [searchTerm, setSearchTerm] = useState('')
    const [filterGender, setFilterGender] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [filterSmoker, setFilterSmoker] = useState('') 
    const [filterDrinking, setFilterDrinking] = useState('')
    const [showFilters, setShowFilters] = useState(false) 

    const fetchUsers = async () => {
        if (!userData) return; 

        try {
            setLoading(true)
            axios.defaults.withCredentials = true
            
            const roomRes = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (roomRes.data.success) {
                if (roomRes.data.rooms.length === 0) {
                    toast.info("Please post your room details first.")
                    navigate('/post-room')
                    return;
                }
                
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (filterGender) params.append('gender', filterGender);
                if (filterStatus) params.append('status', filterStatus);
                if (filterSmoker) params.append('smoker', filterSmoker);
                if (filterDrinking) params.append('drinking', filterDrinking);

                const userRes = await axios.get(`${backendUrl}/api/user/all-users?${params.toString()}`)
                
                if (userRes.data.success) {
                    setUsers(userRes.data.users)
                }
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchUsers();
        }, 500); 
        
        return () => clearTimeout(delayDebounce);
    }, [userData, searchTerm, filterGender, filterStatus, filterSmoker, filterDrinking])

    const handleSendRequest = (userId) => {
        toast.info("Request feature coming soon!")
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            
            <div className="container mx-auto px-4 py-24 sm:px-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 text-center">Find Your Future Roommate</h1>
                <p className="text-center text-slate-500 mb-10">Connect with people compatible with your lifestyle.</p>
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-6 mb-12 border border-slate-100">
                    
                    {/* Search Bar & Filter Toggle */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text" 
                                placeholder="Search by Name, Location, or Institution..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                            />
                            {/* Search Icon */}
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <button 
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${showFilters ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            Filters
                        </button>
                    </div>

                    {/* Filter Options (Collapsible) */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 mt-6 opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
                        
                        {/* Gender */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Gender</label>
                            <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-Binary">Non-Binary</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Status</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Status</option>
                                <option value="Student">Student</option>
                                <option value="Professional">Professional</option>
                            </select>
                        </div>

                        {/* Smoking */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Smoking</label>
                            <select value={filterSmoker} onChange={(e) => setFilterSmoker(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="false">Non-Smoker Only</option>
                                <option value="true">Smoker Allowed</option>
                            </select>
                        </div>

                        {/* Drinking */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Drinking</label>
                            <select value={filterDrinking} onChange={(e) => setFilterDrinking(e.target.value)} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 cursor-pointer">
                                <option value="">Any Preference</option>
                                <option value="false">Non-Drinker Only</option>
                                <option value="true">Drinker Allowed</option>
                            </select>
                        </div>
                    </div>
                </div>
                {loading ? (
                     <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : users.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No matching roommates found.</p>
                        <button onClick={() => {setSearchTerm(''); setFilterGender(''); setFilterStatus(''); setFilterSmoker(''); setFilterDrinking('')}} className="mt-4 text-indigo-600 hover:underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {users.map((user, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                
                                {/* 1. IMAGE SECTION (Top Half) */}
                                <div className="w-full h-72 relative bg-gray-200 group overflow-hidden">
                                    <div className="w-full h-full relative transition-transform duration-700 group-hover:scale-105">
                                        {user.image ? (
                                            <img 
                                                src={user.image} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                                                <span className="text-6xl font-bold opacity-80">{user.name[0].toUpperCase()}</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* COMPATIBILITY SCORE PLACEHOLDER */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                                        <span className="text-xs font-bold text-slate-500">Match</span>
                                        <span className="text-sm font-black text-green-600">85%</span>
                                    </div>
                                </div>

                                {/* 2. INFO SECTION (Bottom Half) */}
                                <div className="p-5 flex flex-col flex-1 gap-3">
                                    
                                    {/* Name & Age */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">{user.name}</h3>
                                            <p className="text-indigo-500 font-medium text-sm mt-0.5">{user.institution || 'N/A'}</p>
                                        </div>
                                        {user.age && (
                                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold border border-slate-200">
                                                {user.age} yo
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-1 mb-2">
                                        {/* Gender */}
                                        <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                                            {user.gender || 'Any'}
                                        </span>
                                        
                                        {/* Smoking */}
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.smoker ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                            {user.smoker ? 'Smoker' : 'Non-Smoker'}
                                        </span>

                                        {/* Drinking */}
                                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${user.drinking ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                            {user.drinking ? 'Drinker' : 'No Drink'}
                                        </span>

                                        {/* Food Habit */}
                                        {user.foodHabits && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-orange-50 text-orange-600 border border-orange-100">
                                                {user.foodHabits}
                                            </span>
                                        )}

                                        {/* Cleanliness */}
                                        {user.cleanlinessLevel && (
                                            <span className="text-[10px] uppercase font-bold px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-100">
                                                {user.cleanlinessLevel} Clean
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1"></div>

                                    {/* BUTTONS ROW */}
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button 
                                            onClick={() => handleSendRequest(user._id)}
                                            className="py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            Request
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/view-profile/${user._id}`)}
                                            className="py-2.5 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
                                        >
                                            View Profile
                                        </button>
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