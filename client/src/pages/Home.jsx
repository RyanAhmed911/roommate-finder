import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='min-h-screen relative w-full overflow-hidden flex flex-col items-center justify-center text-white'>
      
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className='absolute top-0 left-0 w-full h-full object-cover -z-20'
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40 -z-10"></div>
      
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home