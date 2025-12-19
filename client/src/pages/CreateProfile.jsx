import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const InputField = ({ label, value, onChange, type = "text", placeholder, required = false }) => (
  <div className="flex flex-col gap-2">
      <label className="text-indigo-300 text-sm font-medium ml-2">{label} {required && <span className="text-red-400">*</span>}</label>
      <div className="w-full px-5 py-3 rounded-full bg-[#333A5C] focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
          <input 
          value={value}
          onChange={onChange}
          className="bg-transparent outline-none text-white w-full placeholder-indigo-300/50"
          type={type}
          placeholder={placeholder}
          required={required}
          />
      </div>
  </div>
);

const ToggleSwitch = ({ label, checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer justify-between w-full bg-[#333A5C] px-5 py-3 rounded-full">
      <span className="text-indigo-300 font-medium text-sm">{label}</span>
      <div className="relative">
          <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
      </div>
  </label>
);

const CreateProfile = () => {

  const navigate = useNavigate()
  const { backendUrl, userData, getUserData } = useContext(AppContent)

  const [age, setAge] = useState('')
  const [gender, setGender] = useState('') 
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
      
      const { data } = await axios.post(backendUrl + '/api/user/update-profile', {
        userId: userData?._id,
        age: Number(age),
        gender,
        location,
        institution,
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
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 py-10">
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-32 sm:w-40 cursor-pointer" />
      
      <div className="bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-2xl text-sm mt-20 sm:my-10">
        
        <h2 className="text-3xl font-bold text-white text-center mb-2">Setup Your Profile</h2>
        <p className="text-center text-indigo-300 mb-10">Help others get to know you better.</p>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
          
          <div className='flex flex-col sm:flex-row gap-6'>
            <div className="flex-1">
                <InputField 
                    label="Age" 
                    value={age} 
                    onChange={e => setAge(e.target.value)} 
                    type="number" placeholder="e.g. 24" required 
                />
            </div>
            <div className="flex-1 flex flex-col gap-2">
               <label className="text-indigo-300 text-sm font-medium ml-2">Gender <span className="text-red-400">*</span></label>
               <div className="px-5 py-3 rounded-full bg-[#333A5C] relative focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                  <select 
                      onChange={e => setGender(e.target.value)} 
                      value={gender}
                      required 
                      className={`bg-transparent outline-none w-full appearance-none cursor-pointer ${gender === "" ? 'text-indigo-300/50' : 'text-white'}`}
                  >
                      <option value="" disabled hidden>Select Gender</option>
                      <option value="Male" className="text-slate-900">Male</option>
                      <option value="Female" className="text-slate-900">Female</option>
                      <option value="Non-Binary" className="text-slate-900">Non-Binary</option>
                      <option value="Other" className="text-slate-900">Other</option>
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
               </div>
            </div>
          </div>

          <InputField 
            label="Current Location" 
            value={location} 
            onChange={e => setLocation(e.target.value)} 
            placeholder="City, Area" required 
          />

           <div className='flex flex-col sm:flex-row gap-6'>
              <div className="flex-1">
                <InputField label="Institution / University" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Where do you study?" />
              </div>
              <div className="flex-1">
                 <InputField label="Personality Type" value={personalityType} onChange={e => setPersonalityType(e.target.value)} placeholder="e.g. Introvert, Night Owl" />
              </div>
           </div>

          <InputField 
            label="Hobbies & Interests" 
            value={hobbies} 
            onChange={e => setHobbies(e.target.value)} 
            placeholder="Reading, Gaming, Cooking (comma separated)" 
          />

          <InputField 
            label="Medical Conditions" 
            value={medicalConditions} 
            onChange={e => setMedicalConditions(e.target.value)} 
            placeholder="Any allergies or conditions roommates should know? (comma separated)" 
          />

          <div className="my-4 border-b border-slate-700"></div>

          <h3 className="text-white font-medium mb-2 ml-2">Preferences</h3>
          <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                 <ToggleSwitch label="Do you smoke?" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} />
              </div>
              <div className="flex-1">
                 <ToggleSwitch label="Are visitors allowed?" checked={visitors} onChange={(e) => setVisitors(e.target.checked)} />
              </div>
          </div>

          <button className="w-full py-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300 mt-8 shadow-lg">
            Save & Finish Profile
          </button>

        </form>
      </div>
    </div>
  )
}

export default CreateProfile