import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const Requests = ({ onClose }) => {
    const { backendUrl } = useContext(AppContent)
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequests = async () => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.get(backendUrl + '/api/request/my-requests')
            if (data.success) {
                setRequests(data.requests)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRespond = async (requestId, action) => {
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/request/respond', { requestId, action })
            
            if (data.success) {
                toast.success(data.message)
                fetchRequests() // Refresh list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                
                {/* Header */}
                <div className="bg-indigo-600 p-5 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        📩 Room Requests
                    </h2>
                    <button onClick={onClose} className="text-indigo-200 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                    {loading ? (
                        <div className="text-center py-8 text-slate-400">Loading requests...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                            <p>No pending requests.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {requests.map((req) => (
                                <div key={req._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                                            {req.senderId.image ? (
                                                <img src={req.senderId.image} className="w-full h-full object-cover" alt={req.senderId.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                                    {req.senderId.name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-lg leading-tight">{req.senderId.name}</p>
                                            <p className="text-sm text-slate-500">{req.senderId.email}</p>
                                            <p className="text-xs text-indigo-500 font-medium mt-1">
                                                Wants to join: {req.roomId.location}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleRespond(req._id, 'rejected')}
                                            className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors">
                                            Reject
                                        </button>
                                        <button 
                                            onClick={() => handleRespond(req._id, 'accepted')}
                                            className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                                            Accept
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Requests