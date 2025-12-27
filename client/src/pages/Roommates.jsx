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

    const checkRoomAndFetchUsers = async () => {
        if (!userData) return; 

        try {
            axios.defaults.withCredentials = true
            
            const roomRes = await axios.get(backendUrl + '/api/room/my-rooms')
            
            if (roomRes.data.success) {
                if (roomRes.data.rooms.length === 0) {
                    toast.info("Please post your room details first.")
                    navigate('/post-room')
                    return;
                }
                
                const userRes = await axios.get(backendUrl + '/api/user/all-users')
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
        checkRoomAndFetchUsers()
    }, [userData]) 

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-50 pt-20">
            <Navbar />
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Find Roommates</h1>
                
                {users.length === 0 ? (
                    <p className="text-center text-gray-500">No matching roommates found right now.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {users.map((user, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
                                <div className="flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden mb-4">
                                        {user.image ? <img src={user.image} className="w-full h-full object-cover"/> : <span className="text-2xl font-bold text-indigo-600">{user.name[0]}</span>}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                                    <p className="text-sm text-slate-500">{user.age ? `${user.age} years` : ''} • {user.gender || 'N/A'}</p>
                                    <p className="text-xs text-indigo-500 mt-1 font-semibold">{user.institution || 'N/A'}</p>
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