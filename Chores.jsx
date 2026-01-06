import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { toast } from 'react-toastify'

const Chores = () => {
    const { backendUrl, userData } = useContext(AppContent)
    
    const [chores, setChores] = useState([])
    const [roommates, setRoommates] = useState([]) // To populate dropdown
    const [loading, setLoading] = useState(false)

    // Form
    const [title, setTitle] = useState('')
    const [assignedTo, setAssignedTo] = useState('')
    const [date, setDate] = useState('')

    // Fetch Roommates (to assign tasks to)
    const fetchRoommates = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
            if (data.success && data.rooms.length > 0) {
                // The first room is the user's current room
                setRoommates(data.rooms[0].users)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const fetchChores = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/chore/my-chores')
            if (data.success) {
                setChores(data.chores)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleAddChore = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/chore/add', {
                title,
                assignedTo,
                date
            })

            if (data.success) {
                toast.success("Chore Assigned!")
                setTitle('')
                setAssignedTo('')
                setDate('')
                fetchChores()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const toggleStatus = async (chore) => {
        const newStatus = chore.status === 'Completed' ? 'Pending' : 'Completed'
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.put(backendUrl + '/api/chore/update-status', {
                choreId: chore._id,
                status: newStatus
            })
            if (data.success) {
                fetchChores()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleDelete = async (id) => {
        if(!confirm("Remove this chore?")) return;
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/chore/delete', { choreId: id })
            if (data.success) fetchChores()
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (userData) {
            fetchRoommates()
            fetchChores()
        }
    }, [userData])

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <h1 className="text-3xl font-bold text-slate-800 text-center mb-2">Chore Scheduler</h1>
                <p className="text-center text-slate-500 mb-8">Keep the house clean, together!</p>

                {/* --- Assign Chore Form --- */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 mb-8">
                    <h3 className="text-lg font-bold text-indigo-600 mb-4">Assign New Chore</h3>
                    <form onSubmit={handleAddChore} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                            type="text" 
                            placeholder="Task (e.g. Vacuum Living Room)" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}
                            required
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 md:col-span-1"
                        />
                        <select 
                            value={assignedTo} 
                            onChange={e => setAssignedTo(e.target.value)}
                            required
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 cursor-pointer"
                        >
                            <option value="">Assign To...</option>
                            {roommates.map(u => (
                                <option key={u._id} value={u._id}>{u.name}</option>
                            ))}
                        </select>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)}
                            required
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                        />
                        <button 
                            disabled={loading}
                            className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg">
                            {loading ? 'Assigning...' : 'Assign'}
                        </button>
                    </form>
                </div>

                {/* --- Chore List --- */}
                <div className="grid gap-4">
                    {chores.map((chore) => (
                        <div key={chore._id} className={`bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between transition-all ${chore.status === 'Completed' ? 'opacity-60 bg-gray-50' : ''}`}>
                            <div className="flex items-center gap-4">
                                {/* Checkbox / Status Toggle */}
                                <button 
                                    onClick={() => toggleStatus(chore)}
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${chore.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-indigo-400'}`}>
                                    ✓
                                </button>
                                
                                <div>
                                    <h4 className={`font-bold text-lg ${chore.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                                        {chore.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <span>Assigned to: <span className="font-semibold text-indigo-500">{chore.assignedTo?.name}</span></span>
                                        <span>•</span>
                                        <span>Due: {new Date(chore.date).toDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => handleDelete(chore._id)}
                                className="text-red-300 hover:text-red-500 transition-colors p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </div>
                    ))}
                    
                    {chores.length === 0 && <p className="text-center text-slate-400 mt-8">No chores scheduled. Relax! 🎉</p>}
                </div>
            </div>
        </div>
    )
}

export default Chores