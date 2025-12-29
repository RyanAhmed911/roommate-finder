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

const SelectField = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-2">
        <label className="text-indigo-300 text-sm font-medium ml-2">{label}</label>
        <div className="w-full px-5 py-3 rounded-full bg-[#333A5C] relative focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <select 
                value={value} 
                onChange={onChange} 
                className="bg-transparent outline-none text-white w-full appearance-none cursor-pointer">
                {options.map((opt) => (
                    <option key={opt} value={opt} className="text-slate-900">{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    </div>
);

const CreateProfile = () => {

  const navigate = useNavigate()
  const { backendUrl, userData, getUserData } = useContext(AppContent)

  const [image, setImage] = useState(false) 
  const [imagePreview, setImagePreview] = useState('') 
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('') 
  const [location, setLocation] = useState('')
  const [institution, setInstitution] = useState('')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [status, setStatus] = useState('')
  const [hobbies, setHobbies] = useState('')
  const [personalityType, setPersonalityType] = useState('')
  const [medicalConditions, setMedicalConditions] = useState('')
  const [languages, setLanguages] = useState('')
  const [cleanlinessLevel, setCleanlinessLevel] = useState('Moderate')
  const [sleepSchedule, setSleepSchedule] = useState('Flexible')
  const [noiseTolerance, setNoiseTolerance] = useState('Moderate')
  const [foodHabits, setFoodHabits] = useState('Non-Vegetarian')
  const [smoker, setSmoker] = useState(false)
  const [visitors, setVisitors] = useState(false)
  const [petsAllowed, setPetsAllowed] = useState(false)
  const [drinking, setDrinking] = useState(false)

  React.useEffect(() => {
    if (userData) {
      setAge(userData.age || '')
      setGender(userData.gender || '')
      setLocation(userData.location || '')
      setInstitution(userData.institution || '')
      setPhone(userData.phone || '')
      setStatus(userData.status || '') 
      setNationality(userData.nationality || '')
      setPersonalityType(userData.personalityType || '')
      setCleanlinessLevel(userData.cleanlinessLevel || 'Moderate')
      setSleepSchedule(userData.sleepSchedule || 'Flexible')
      setNoiseTolerance(userData.noiseTolerance || 'Moderate')
      setFoodHabits(userData.foodHabits || 'Non-Vegetarian')
      setSmoker(userData.smoker || false)
      setVisitors(userData.visitors || false)
      setPetsAllowed(userData.petsAllowed || false)
      setDrinking(userData.drinking || false)

      if (Array.isArray(userData.languages)) setLanguages(userData.languages.join(', '))
      if (Array.isArray(userData.hobbies)) setHobbies(userData.hobbies.join(', '))
      if (Array.isArray(userData.medicalConditions)) setMedicalConditions(userData.medicalConditions.join(', '))
      if (userData.image) setImagePreview(userData.image)
    }
  }, [userData])

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
    try {
      axios.defaults.withCredentials = true

      const hobbiesArray = hobbies.split(',').map(item => item.trim())
      const medicalArray = medicalConditions.split(',').map(item => item.trim())
      const languagesArray = languages.split(',').map(item => item.trim())

      let imageBase64 = userData.image || ""; 
      if (image) {
        imageBase64 = await convertToBase64(image);
      }

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', {
        userId: userData?._id,
        age: Number(age),
        gender,
        location,
        institution,
        phone,
        status, 
        nationality,
        languages: languagesArray,
        hobbies: hobbiesArray,
        personalityType,
        medicalConditions: medicalArray,
        cleanlinessLevel,
        sleepSchedule,
        noiseTolerance,
        foodHabits,
        smoker,
        visitors,
        petsAllowed,
        drinking,
        image: imageBase64,
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
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-0 bg-[radial-gradient(circle_at_50%_30%,_#f5f3ff,_#c4b5fd,_#7c3aed)] py-10">
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-32 sm:w-40 cursor-pointer" />
      
      <div className="bg-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl w-full max-w-2xl text-sm mt-20 sm:my-10">
        
        <h2 className="text-3xl font-bold text-white text-center mb-2">Setup Your Profile</h2>
        <p className="text-center text-indigo-300 mb-8">Help others get to know you better</p>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-6'>
          
          {/* Image Upload */}
          <div className="flex flex-col items-center gap-4 mb-1">
            <label htmlFor="image-upload" className="cursor-pointer group relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#333A5C] group-hover:border-indigo-500 transition-all flex items-center justify-center bg-[#333A5C]">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-xs font-semibold">Upload</p>
                </div>
            </label>
            <input onChange={handleImageChange} type="file" id="image-upload" hidden accept="image/*" />
          </div>

          <p className="text-center text-indigo-300 mb-8">Upload your profile picture</p>

          {/* Age & Gender */}
          <div className='flex flex-col sm:flex-row gap-6'>
            <div className="flex-1">
                <InputField label="Age" value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="e.g. 24" required />
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

          <InputField label="Current Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="City, Area" required />

          {/* Institution & Phone */}
          <div className='flex flex-col sm:flex-row gap-6'>
              <div className="flex-1">
                <InputField label="Institution / University" value={institution} onChange={e => setInstitution(e.target.value)} placeholder="Where do you study?" />
              </div>
              <div className="flex-1">
                 <InputField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+880 1XXX..." />
              </div>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-6'>
            <div className="flex-1">
                <InputField label="Nationality" value={nationality} onChange={e => setNationality(e.target.value)} placeholder="e.g. Bangladeshi" />
            </div>
            <div className="flex-1">
                <InputField label="Languages Spoken" value={languages} onChange={e => setLanguages(e.target.value)} placeholder="English, Bengali..." />
            </div>
          </div>

          <div className="my-2 border-b border-slate-700"></div>
          <h3 className="text-white font-medium mb-2 ml-2">Personality & Lifestyle</h3>

          <div className='flex flex-col sm:flex-row gap-6'>
            <div className="flex-1">
                <InputField label="Personality Type" value={personalityType} onChange={e => setPersonalityType(e.target.value)} placeholder="e.g. Introvert, Night Owl" />
            </div>
            <div className="flex-1">
                <InputField label="Hobbies" value={hobbies} onChange={e => setHobbies(e.target.value)} placeholder="Gaming, Reading..." />
            </div>
          </div>
          
          {/* Lifestyle Dropdowns Row 1 */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <SelectField 
                label="Food Habits" 
                value={foodHabits} 
                onChange={e => setFoodHabits(e.target.value)} 
                options={['Non-Vegetarian', 'Vegetarian', 'Vegan']} 
              />
               <SelectField 
                label="Cleanliness Level" 
                value={cleanlinessLevel} 
                onChange={e => setCleanlinessLevel(e.target.value)} 
                options={['Neat', 'Moderate', 'Laid-back']} 
              />
          </div>

          {/* Lifestyle Dropdowns Row 2 */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              <SelectField 
                label="Sleep Schedule" 
                value={sleepSchedule} 
                onChange={e => setSleepSchedule(e.target.value)} 
                options={['Early Bird', 'Night Owl', 'Flexible']} 
              />
               <SelectField 
                label="Noise Tolerance" 
                value={noiseTolerance} 
                onChange={e => setNoiseTolerance(e.target.value)} 
                options={['Low', 'Moderate', 'High']} 
              />
          </div>

          <InputField label="Medical Conditions" value={medicalConditions} onChange={e => setMedicalConditions(e.target.value)} placeholder="Any allergies? (comma separated)" />

          <div className="my-2 border-b border-slate-700"></div>

          <h3 className="text-white font-medium mb-2 ml-2">Preferences</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ToggleSwitch label="Do you smoke?" checked={smoker} onChange={(e) => setSmoker(e.target.checked)} />
              <ToggleSwitch label="Do you drink?" checked={drinking} onChange={(e) => setDrinking(e.target.checked)} />
              <ToggleSwitch label="Visitors allowed?" checked={visitors} onChange={(e) => setVisitors(e.target.checked)} />
              <ToggleSwitch label="Pets allowed?" checked={petsAllowed} onChange={(e) => setPetsAllowed(e.target.checked)} />
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