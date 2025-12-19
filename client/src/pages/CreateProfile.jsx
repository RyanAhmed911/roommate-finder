import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const CreateProfile = () => {

  const navigate = useNavigate()
  const { backendUrl, userData, getUserData } = useContext(AppContent)

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('Male')
  const [location, setLocation] = useState('')
  const [institution, setInstitution] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [personalityType, setPersonalityType] = useState('')
  const [medicalConditions, setMedicalConditions] = useState('')
  const [smoker, setSmoker] = useState(false)
  const [visitors, setVisitors] = useState(false)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      axios.defaults.withCredentials = true

      const hobbiesArray = hobbies.split(',').map(item => item.trim())
      const medicalArray = medicalConditions.split(',').map(item => item.trim())
      const institutionArray = institution.split(',').map(item => item.trim())

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', {
        userId: userData?._id, 
        age: Number(age),
        gender,
        location,
        institution: institutionArray,
        hobbies: hobbiesArray,
        personalityType,
        medicalConditions: medicalArray,
        smoker,
        visitors
      })

      if (data.success) {
        toast.success(data.message)
        await getUserData() 
        navigate('/')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 py-10">
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-40 sm:w-48 cursor-pointer" />
      
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-[500px] text-indigo-300 text-sm mt-20 sm:mt-0">
        
        <h2 className="text-3xl font-semibold text-white text-center mb-3">Complete Profile</h2>
        <p className="text-center text-sm mb-6">Tell us about yourself to find the perfect roommate.</p>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
          
          <div className='flex gap-4'>
            <div className="flex-1 px-5 py-2.5 rounded-full bg-[#333A5C]">
              <input 
                onChange={e => setAge(e.target.value)} 
                value={age} 
                className="bg-transparent outline-none text-white w-full" type="number" placeholder="Age" required
              />
            </div>
            <div className="flex-1 px-5 py-2.5 rounded-full bg-[#333A5C] relative">
               <select 
                  onChange={e => setGender(e.target.value)} 
                  value={gender}
                  className="bg-transparent outline-none text-white w-full appearance-none cursor-pointer"
               >
                  <option value="Male" className="text-slate-900">Male</option>
                  <option value="Female" className="text-slate-900">Female</option>
                  <option value="Non-Binary" className="text-slate-900">Non-Binary</option>
                  <option value="Other" className="text-slate-900">Other</option>
               </select>
            </div>
          </div>

          <div className="w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input 
              onChange={e => setLocation(e.target.value)} 
              value={location} 
              className="bg-transparent outline-none text-white w-full" type="text" placeholder="Location (City/Area)" required
            />
          </div>

           <div className="w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input 
              onChange={e => setInstitution(e.target.value)} 
              value={institution} 
              className="bg-transparent outline-none text-white w-full" type="text" placeholder="Institution / University" 
            />
          </div>

          <div className="w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input 
              onChange={e => setPersonalityType(e.target.value)} 
              value={personalityType} 
              className="bg-transparent outline-none text-white w-full" type="text" placeholder="Personality Type (e.g. Introvert, Night Owl)" 
            />
          </div>

          <div className="w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input 
              onChange={e => setHobbies(e.target.value)} 
              value={hobbies} 
              className="bg-transparent outline-none text-white w-full" type="text" placeholder="Hobbies (comma separated)" 
            />
          </div>

           <div className="w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <input 
              onChange={e => setMedicalConditions(e.target.value)} 
              value={medicalConditions} 
              className="bg-transparent outline-none text-white w-full" type="text" placeholder="Medical Conditions (Optional)" 
            />
          </div>

          <div className="flex justify-between px-2 text-white">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={smoker} 
                onChange={(e) => setSmoker(e.target.checked)} 
                className="w-4 h-4 accent-indigo-500"
              />
              <span>Smoker?</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={visitors} 
                onChange={(e) => setVisitors(e.target.checked)} 
                className="w-4 h-4 accent-indigo-500"
              />
              <span>Visitors Allowed?</span>
            </label>
          </div>

          <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:scale-105 transition-all duration-300 mt-4">
            Save Profile
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateProfile