import React, { useContext } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const Notifications = ({ requests, fetchRequests, onClose }) => {
    const { backendUrl, userData } = useContext(AppContent)

    const handleRespond = async (requestId, action) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/request/respond', { requestId, action })
            
            if (data.success) {
                toast.success(data.message)
                fetchRequests() // Refresh list in Navbar
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (!requests || requests.length === 0) {
        return (
            <div className="absolute top-16 right-4 w-80 bg-white shadow-xl rounded-xl z-50 overflow-hidden border border-gray-100 animate-fadeIn p-4 text-center text-slate-500 text-sm">
                No new notifications
            </div>
        )
    }

    return (
        <div className="absolute top-16 right-4 w-80 md:w-96 bg-white shadow-xl rounded-xl z-50 overflow-hidden border border-gray-100 animate-fadeIn">
            <div className="bg-indigo-600 px-4 py-3 flex justify-between items-center text-white">
                <h3 className="font-bold text-sm">Notifications</h3>
                <button onClick={onClose} className="text-indigo-200 hover:text-white">✕</button>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                {requests.map((req) => {
                    // Determine Type: If I (userData) am in the room users list, I am the Owner (Join Request).
                    // Otherwise, I am a potential Tenant (Invite).
                    const isOwner = req.roomId.users.some(id => String(id) === String(userData._id));
                    const isInvite = !isOwner;

                    return (
                        <div key={req._id} className="p-4 border-b border-gray-100 hover:bg-slate-50 transition-colors">
                            <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                                    {req.senderId.image ? (
                                        <img src={req.senderId.image} className="w-full h-full object-cover" alt={req.senderId.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold text-sm">
                                            {req.senderId.name[0]}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        {req.senderId.name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {isInvite ? 'Invited you to join:' : 'Wants to join:'} <span className="text-indigo-600 font-medium">{req.roomId.location}</span>
                                    </p>
                                    {isInvite && (
                                        <p className="text-xs text-slate-400 mt-0.5">Rent: ৳{req.roomId.rent}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleRespond(req._id, 'accepted')}
                                    className="flex-1 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                                    Accept
                                </button>
                                <button 
                                    onClick={() => handleRespond(req._id, 'rejected')}
                                    className="flex-1 py-1.5 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors">
                                    Decline
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Notifications