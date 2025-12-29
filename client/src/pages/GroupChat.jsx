import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const GroupChat = () => {
    const { backendUrl } = useContext(AppContent)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkRoom = async () => {
            try {
                axios.defaults.withCredentials = true
                const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
                if (!data.success || data.rooms.length === 0) {
                    toast.error("Room not found")
                    navigate('/my-room')
                }
            } catch (error) {
                navigate('/my-room')
            } finally {
                setLoading(false)
            }
        }
        checkRoom()
    }, [backendUrl, navigate])

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate('/my-room')} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors">
                        <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Group Chat</h1>
                </div>
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center border border-slate-200">
                    <h2 className="text-xl font-bold text-slate-400">Coming Soon</h2>
                    <p className="text-slate-500">Chat functionality will be implemented here.</p>
                </div>
            </div>
        </div>
    )
}

export default GroupChat