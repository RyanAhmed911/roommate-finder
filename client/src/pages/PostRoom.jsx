import React, { useContext, useState } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

const PostRoom = () => {
    const { backendUrl } = useContext(AppContent)
    const navigate = useNavigate()

    const [location, setLocation] = useState('')
    const [rent, setRent] = useState('')
    const [capacity, setCapacity] = useState(1)
    const [floor, setFloor] = useState('')
    const [area, setArea] = useState('')
    const [balcony, setBalcony] = useState(false)
    const [attachedBathroom, setAttachedBathroom] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/room/create', {
                location, rent, capacity, floor, area, balcony, attachedBathroom
            })

            if (data.success) {
                toast.success("Room Posted Successfully!")
                // After posting, go to the roommates page
                navigate('/roommates')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 py-10 px-4">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-lg text-white">
                <h2 className="text-3xl font-bold text-center mb-2">Post Your Room</h2>
                <p className="text-center text-indigo-300 mb-8">Share details to find the perfect roommate.</p>

                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
                    
                    <div>
                        <label className="block text-indigo-300 mb-1 text-sm">Location</label>
                        <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none" type="text" placeholder="e.g. Uttara, Sector 4" value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-indigo-300 mb-1 text-sm">Rent (BDT)</label>
                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none" type="number" placeholder="5000" value={rent} onChange={e => setRent(e.target.value)} required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-indigo-300 mb-1 text-sm">Capacity</label>
                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-indigo-300 mb-1 text-sm">Floor No.</label>
                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none" type="number" value={floor} onChange={e => setFloor(e.target.value)} required />
                        </div>
                        <div className="flex-1">
                            <label className="block text-indigo-300 mb-1 text-sm">Area (sq ft)</label>
                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none" type="number" value={area} onChange={e => setArea(e.target.value)} required />
                        </div>
                    </div>

                    <div className="flex justify-between mt-2 px-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} className="w-5 h-5 accent-indigo-500"/>
                            <span>Balcony Available</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={attachedBathroom} onChange={e => setAttachedBathroom(e.target.checked)} className="w-5 h-5 accent-indigo-500"/>
                            <span>Attached Bath</span>
                        </label>
                    </div>

                    <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-full font-bold mt-6 hover:scale-105 transition-all">
                        Post & Find Roommates
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PostRoom