import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api' // ✅ uses your axios instance (baseURL + withCredentials)

const PostRoom = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // Room Details
    const [location, setLocation] = useState('')
    const [rent, setRent] = useState('')
    const [capacity, setCapacity] = useState(1)
    const [floor, setFloor] = useState('')
    const [area, setArea] = useState('')
    const [balcony, setBalcony] = useState(false)
    const [attachedBathroom, setAttachedBathroom] = useState(false)

    // Personal Information
    const [personalityType, setPersonalityType] = useState('')
    const [hobbies, setHobbies] = useState('')

    // Lifestyle Habits
    const [foodHabits, setFoodHabits] = useState('')
    const [sleepSchedule, setSleepSchedule] = useState('')
    const [cleanlinessLevel, setCleanlinessLevel] = useState('')
    const [noiseTolerance, setNoiseTolerance] = useState('')

    // Medical Conditions
    const [medicalConditions, setMedicalConditions] = useState('')

    // Preferences & Dealbreakers
    const [smoker, setSmoker] = useState(false)
    const [drinking, setDrinking] = useState(false)
    const [visitors, setVisitors] = useState(false)
    const [petsAllowed, setPetsAllowed] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (loading) return

        if (!location || !rent || !capacity || !floor || !area) {
            alert("Please fill up all Room Details fields.")
            return
        }

        setLoading(true)

        // Convert comma-separated strings to arrays
        const hobbiesArray = hobbies.split(',').map(h => h.trim()).filter(h => h)
        const medicalArray = medicalConditions.split(',').map(m => m.trim()).filter(m => m)

        try {
            // ✅ Send ALL fields including preferences
            const payload = {
                location,
                rent: Number(rent),
                capacity: Number(capacity),
                floor: Number(floor),
                area: Number(area),
                balcony,
                attachedBathroom,
                // Add all preference fields
                personalityType,
                hobbies: hobbiesArray,
                foodHabits,
                sleepSchedule,
                cleanlinessLevel,
                noiseTolerance,
                medicalConditions: medicalArray,
                smoker,
                drinking,
                visitors,
                petsAllowed
            }

            const res = await api.post('/room/create', payload)

            if (res.data?.success) {
                alert('Room posted successfully!')
                navigate('/rooms')
            } else {
                alert(res.data?.message || 'Failed to post room')
            }
        } catch (err) {
            console.error(err)
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Network error while posting room'
            alert(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-purple-400 py-10 px-4">
            <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white">
                <h2 className="text-3xl font-bold text-center mb-2">Post Your Room</h2>
                <p className="text-center text-indigo-300 mb-8">Share details to find the perfect roommate.</p>

                <div className="flex flex-col gap-6">

                    {/* Room Details Section */}
                    <div className="bg-[#1e2746] p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-indigo-300 mb-4">Room Details</h3>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Location</label>
                                <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="text" placeholder="e.g. Uttara, Sector 4" value={location} onChange={e => setLocation(e.target.value)} required />
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-indigo-300 mb-1 text-sm">Rent (BDT)</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="number" placeholder="5000" value={rent} onChange={e => setRent(e.target.value)} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-indigo-300 mb-1 text-sm">Capacity</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="number" min="1" value={capacity} onChange={e => setCapacity(e.target.value)} required />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-indigo-300 mb-1 text-sm">Floor No.</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="number" value={floor} onChange={e => setFloor(e.target.value)} required />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-indigo-300 mb-1 text-sm">Area (sq ft)</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="number" value={area} onChange={e => setArea(e.target.value)} required />
                                </div>
                            </div>

                            <div className="flex justify-between mt-2 px-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={balcony} onChange={e => setBalcony(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                    <span>Balcony Available</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={attachedBathroom} onChange={e => setAttachedBathroom(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                    <span>Attached Bath</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preferences for Roommates Section */}
                    <div className="bg-[#1e2746] p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-indigo-300 mb-4">Your Preferences for Roommates</h3>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Personality Type</label>
                                <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="text" placeholder="e.g. Introvert, Extrovert, Ambivert" value={personalityType} onChange={e => setPersonalityType(e.target.value)} />
                            </div>

                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Hobbies (comma separated)</label>
                                <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="text" placeholder="e.g. Reading, Gaming, Cooking" value={hobbies} onChange={e => setHobbies(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Lifestyle & Habits Section */}
                    <div className="bg-[#1e2746] p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-indigo-300 mb-4">Lifestyle & Habits</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Food Habits</label>
                                <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer appearance-none" value={foodHabits} onChange={e => setFoodHabits(e.target.value)} style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a5b4fc%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
                                    <option value="">Select Food Habits</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Sleep Schedule</label>
                                <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer appearance-none" value={sleepSchedule} onChange={e => setSleepSchedule(e.target.value)} style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a5b4fc%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
                                    <option value="">Select Sleep Schedule</option>
                                    <option value="Early Bird">Early Bird</option>
                                    <option value="Night Owl">Night Owl</option>
                                    <option value="Flexible">Flexible</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Cleanliness Level</label>
                                <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer appearance-none" value={cleanlinessLevel} onChange={e => setCleanlinessLevel(e.target.value)} style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a5b4fc%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
                                    <option value="">Select Cleanliness Level</option>
                                    <option value="Very Clean">Very Clean</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Relaxed">Relaxed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Noise Tolerance</label>
                                <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer appearance-none" value={noiseTolerance} onChange={e => setNoiseTolerance(e.target.value)} style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23a5b4fc%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}>
                                    <option value="">Select Noise Tolerance</option>
                                    <option value="Quiet">Quiet</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="bg-[#1e2746] p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-indigo-300 mb-4">Medical Information</h3>

                        <div>
                            <label className="block text-indigo-300 mb-1 text-sm">Medical Conditions (comma separated, optional)</label>
                            <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white" type="text" placeholder="e.g. Allergies, Asthma" value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} />
                        </div>
                    </div>

                    {/* Preferences & Dealbreakers Section */}
                    <div className="bg-[#1e2746] p-6 rounded-xl">
                        <h3 className="text-xl font-semibold text-indigo-300 mb-4">Preferences & Dealbreakers</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition">
                                <input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                <div>
                                    <span className="font-medium">Smoker</span>
                                    <p className="text-xs text-gray-400">I smoke regularly</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition">
                                <input type="checkbox" checked={drinking} onChange={e => setDrinking(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                <div>
                                    <span className="font-medium">Drinker</span>
                                    <p className="text-xs text-gray-400">I consume alcohol</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition">
                                <input type="checkbox" checked={visitors} onChange={e => setVisitors(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                <div>
                                    <span className="font-medium">Visitors Allowed</span>
                                    <p className="text-xs text-gray-400">I have guests over</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition">
                                <input type="checkbox" checked={petsAllowed} onChange={e => setPetsAllowed(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                <div>
                                    <span className="font-medium">Pets Allowed</span>
                                    <p className="text-xs text-gray-400">I have or want pets</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={onSubmitHandler}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3 rounded-full font-bold mt-2 hover:scale-105 transition-all cursor-pointer ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Posting..." : "Post & Find Roommates"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostRoom