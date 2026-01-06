import React, { useContext, useEffect, useState } from 'react'
import { AppContent } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import Navbar from '../components/Navbar'

const PostRoom = () => {
    const { backendUrl, userData } = useContext(AppContent)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [existingRoom, setExistingRoom] = useState(null)

    const [image, setImage] = useState(false)
    const [imagePreview, setImagePreview] = useState('')
    const [personalityType, setPersonalityType] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [foodHabits, setFoodHabits] = useState('')
    const [sleepSchedule, setSleepSchedule] = useState('')
    const [cleanlinessLevel, setCleanlinessLevel] = useState('')
    const [noiseTolerance, setNoiseTolerance] = useState('')
    const [medicalConditions, setMedicalConditions] = useState('')
    
    const [smoker, setSmoker] = useState(false)
    const [drinking, setDrinking] = useState(false)
    const [visitors, setVisitors] = useState(false)
    const [petsAllowed, setPetsAllowed] = useState(false)

    useEffect(() => {
        const fetchUserRoom = async () => {
            try {
                axios.defaults.withCredentials = true
                const { data } = await axios.get(backendUrl + '/api/room/my-rooms')
                
                if (data.success && data.rooms.length > 0) {
                    const room = data.rooms[0]
                    setExistingRoom(room)
                    
                    setPersonalityType(room.personalityType || '')
                    setHobbies(room.hobbies ? room.hobbies.join(', ') : '')
                    setFoodHabits(room.foodHabits || '')
                    setSleepSchedule(room.sleepSchedule || '')
                    setCleanlinessLevel(room.cleanlinessLevel || '')
                    setNoiseTolerance(room.noiseTolerance || '')
                    setMedicalConditions(room.medicalConditions ? room.medicalConditions.join(', ') : '')
                    setSmoker(room.smoker || false)
                    setDrinking(room.drinking || false)
                    setVisitors(room.visitors || false)
                    setPetsAllowed(room.petsAllowed || false)
                    if (room.image) setImagePreview(room.image)
                    
                    setLoading(false)
                } else {
                    toast.info("Please create a room in 'My Room' first before posting.")
                    navigate('/my-room')
                }
            } catch (error) {
                console.error(error)
                toast.error("Failed to fetch room details")
                navigate('/')
            }
        }

        if (userData) {
            fetchUserRoom()
        }
    }, [userData, backendUrl, navigate])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => resolve(fileReader.result);
            fileReader.onerror = (error) => reject(error);
        });
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!existingRoom) return

        setLoading(true)

        const hobbiesArray = hobbies.split(',').map(h => h.trim()).filter(h => h)
        const medicalArray = medicalConditions.split(',').map(m => m.trim()).filter(m => m)

        try {
            axios.defaults.withCredentials = true

            let imageBase64 = existingRoom.image || "";
            if (image) {
                imageBase64 = await convertToBase64(image);
            }
            
            const payload = {
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
                petsAllowed,
                status: true,
                image: imageBase64
            }

            const { data } = await axios.put(backendUrl + '/api/room/' + existingRoom._id, payload)

            if (data.success) {
                toast.success('Room posted successfully!')
                navigate('/rooms')
            } else {
                toast.error(data.message)
            }
        } catch (err) {
            console.error(err)
            toast.error(err.message || 'Network error while posting room')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">Loading your room details...</div>
    }

    return (
        <div className="min-h-screen bg-[#08101C]">
            <Navbar />
            <div className="flex items-center justify-center py-24 px-4">
                <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-white relative">
                    
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 hover:scale-105 border border-slate-700 rounded-full text-indigo-300 hover:text-white transition-all duration-300 backdrop-blur-sm z-10"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    <h2 className="text-3xl font-bold text-center mb-2">Post Your Room</h2>
                    <p className="text-center text-indigo-300 mb-8">Set your roommate preferences to publish your room.</p>

                    <div className="flex flex-col gap-6">
                        {/* Image Upload Section */}
                        <div className="bg-[#1e2746] p-6 rounded-xl border border-indigo-500/30">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                Room Image
                            </h3>
                            
                            <div className="flex flex-col items-center gap-4">
                                <label htmlFor="room-image-upload" className="cursor-pointer group relative">
                                    <div className="w-40 h-40 rounded-xl overflow-hidden border-4 border-[#333A5C] group-hover:border-indigo-500 transition-all flex items-center justify-center bg-[#333A5C]">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Room" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-sm font-semibold">Upload Room Image</p>
                                    </div>
                                </label>
                                <input onChange={handleImageChange} type="file" id="room-image-upload" hidden accept="image/*" />
                                <p className="text-center text-indigo-300 text-sm">Upload a picture of your room</p>
                            </div>
                        </div>

                        <div className="bg-[#1e2746] p-6 rounded-xl border border-indigo-500/30">
                            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Room Details (From My Room)
                            </h3>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm text-indigo-200">
                                <div>
                                    <span className="block text-xs text-indigo-400 uppercase font-bold">Location</span>
                                    <span className="text-white font-medium">{existingRoom.location}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-indigo-400 uppercase font-bold">Rent</span>
                                    <span className="text-white font-medium">৳ {existingRoom.rent}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-indigo-400 uppercase font-bold">Capacity</span>
                                    <span className="text-white font-medium">{existingRoom.capacity} Person(s)</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-indigo-400 uppercase font-bold">Size</span>
                                    <span className="text-white font-medium">{existingRoom.area} sq ft</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1e2746] p-6 rounded-xl">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Your Preferences for Roommates</h3>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Personality Type</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-700 focus:border-indigo-500 transition-colors" type="text" placeholder="e.g. Introvert, Extrovert, Ambivert" value={personalityType} onChange={e => setPersonalityType(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Hobbies (comma separated)</label>
                                    <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-700 focus:border-indigo-500 transition-colors" type="text" placeholder="e.g. Reading, Gaming, Cooking" value={hobbies} onChange={e => setHobbies(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1e2746] p-6 rounded-xl">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Lifestyle & Habits</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Food Habits</label>
                                    <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-700 focus:border-indigo-500 transition-colors" value={foodHabits} onChange={e => setFoodHabits(e.target.value)}>
                                        <option value="">Select Food Habits</option>
                                        <option value="Vegetarian">Vegetarian</option>
                                        <option value="Non-Vegetarian">Non-Vegetarian</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Flexible">Flexible</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Sleep Schedule</label>
                                    <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-700 focus:border-indigo-500 transition-colors" value={sleepSchedule} onChange={e => setSleepSchedule(e.target.value)}>
                                        <option value="">Select Sleep Schedule</option>
                                        <option value="Early Bird">Early Bird</option>
                                        <option value="Night Owl">Night Owl</option>
                                        <option value="Flexible">Flexible</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Cleanliness Level</label>
                                    <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-700 focus:border-indigo-500 transition-colors" value={cleanlinessLevel} onChange={e => setCleanlinessLevel(e.target.value)}>
                                        <option value="">Select Cleanliness Level</option>
                                        <option value="Low">Low</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-indigo-300 mb-1 text-sm">Noise Tolerance</label>
                                    <select className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white cursor-pointer border border-slate-700 focus:border-indigo-500 transition-colors" value={noiseTolerance} onChange={e => setNoiseTolerance(e.target.value)}>
                                        <option value="">Select Noise Tolerance</option>
                                        <option value="Quiet">Quiet</option>
                                        <option value="Moderate">Moderate</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1e2746] p-6 rounded-xl">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Medical Information</h3>

                            <div>
                                <label className="block text-indigo-300 mb-1 text-sm">Medical Conditions (comma separated, optional)</label>
                                <input className="w-full bg-[#333A5C] p-3 rounded-lg outline-none text-white border border-slate-700 focus:border-indigo-500 transition-colors" type="text" placeholder="e.g. Allergies, Asthma" value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} />
                            </div>
                        </div>
                        <div className="bg-[#1e2746] p-6 rounded-xl">
                            <h3 className="text-xl font-semibold text-indigo-300 mb-4">Preferences & Dealbreakers</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition border border-transparent hover:border-indigo-500/50">
                                    <input type="checkbox" checked={smoker} onChange={e => setSmoker(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                    <div>
                                        <span className="font-medium">Smoker</span>
                                        <p className="text-xs text-gray-400">I smoke regularly</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition border border-transparent hover:border-indigo-500/50">
                                    <input type="checkbox" checked={drinking} onChange={e => setDrinking(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                    <div>
                                        <span className="font-medium">Drinker</span>
                                        <p className="text-xs text-gray-400">I consume alcohol</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition border border-transparent hover:border-indigo-500/50">
                                    <input type="checkbox" checked={visitors} onChange={e => setVisitors(e.target.checked)} className="w-5 h-5 accent-indigo-500" />
                                    <div>
                                        <span className="font-medium">Visitors Allowed</span>
                                        <p className="text-xs text-gray-400">I have guests over</p>
                                    </div>
                                </label>
                                <label className="flex items-center gap-3 bg-[#333A5C] p-4 rounded-lg cursor-pointer hover:bg-[#3d4563] transition border border-transparent hover:border-indigo-500/50">
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
                            className={`w-full bg-gradient-to-r from-indigo-500 to-purple-600 py-3.5 rounded-full font-bold mt-4 hover:scale-105 transition-all cursor-pointer shadow-lg hover:shadow-indigo-500/25 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {loading ? "Posting..." : "Post & Find Roommates"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostRoom