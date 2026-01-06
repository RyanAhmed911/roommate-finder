import React, { useContext, useRef, useEffect } from 'react'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'

const Notifications = ({ requests, fetchRequests, onClose }) => {
  const { backendUrl, userData } = useContext(AppContent)
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleRespond = async (requestId, action) => {
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(
        backendUrl + '/api/request/respond',
        { requestId, action }
      )

      if (data.success) {
        toast.success(data.message)
        fetchRequests()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div
  ref={ref}
  className="absolute top-16 right-4 w-80 md:w-96 bg-white shadow-xl rounded-xl border border-indigo-500 z-50 text-sm overflow-hidden"
>
  {/* Header */}
  <div className="flex justify-between items-center px-4 py-3 bg-indigo-500 text-white">
    <h3 className="font-semibold">Notifications</h3>
    <button
      onClick={onClose}
      className="text-indigo-200 hover:text-white text-lg leading-none"
    >
      ✕
    </button>
  </div>

  {/* Scroll container */}
  <div className="max-h-[60vh] overflow-y-auto">
    {/* Empty state */}
    {(!requests || requests.length === 0) && (
      <div className="p-4 text-center text-slate-500">
        No new notifications
      </div>
    )}

    {/* Notifications list */}
    {requests?.map((req) => {
      if (!req.roomId) return null

      const isOwner =
        req.roomId.users?.some(
          (id) => String(id) === String(userData._id)
        )
      const isInvite = !isOwner

      return (
        <div
          key={req._id}
          className="px-4 py-3 border-b border-gray-100 hover:bg-slate-50 transition"
        >
          <div className="flex gap-3 mb-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
              {req.senderId.image ? (
                <img
                  src={req.senderId.image}
                  alt={req.senderId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                  {req.senderId.name[0]}
                </div>
              )}
            </div>

            {/* Text */}
            <div className="leading-snug">
              <p className="font-semibold text-slate-800">
                {req.senderId.name}
              </p>
              <p className="text-slate-600">
                {isInvite ? 'Invited you to join:' : 'Wants to join:'}{' '}
                <span className="text-indigo-600 font-medium">
                  {req.roomId.location}
                </span>
              </p>
              {isInvite && (
                <p className="text-slate-400">
                  Rent: ৳{req.roomId.rent}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => handleRespond(req._id, 'accepted')}
              className="flex-1 py-1.5 rounded-md bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
            >
              Accept
            </button>
            <button
              onClick={() => handleRespond(req._id, 'rejected')}
              className="flex-1 py-1.5 rounded-md border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
            >
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
