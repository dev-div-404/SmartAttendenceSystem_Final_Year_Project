import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate();

  const redirectToLoginPage = (user) =>{
    navigate(`${user}login`)
  }

  return (
    <div className='home-page-main-div'>
        <div className='home-page-banner'>
            <div className='home-page-title'>
                Smart Attendence System
            </div>
            <div className='home-page-developer'>
                by Beddyuti, Debjyoti & Dibyendu ...
            </div>
        </div>
        <div className='home-page-button-holder'>
            <div className='home-page-button-container'>
                <button onClick={() => redirectToLoginPage('teacher')}>Log in as Teacher</button>
                <button onClick={() => redirectToLoginPage('admin')}>Log in as Admin</button>
            </div>
        </div>
    </div>
  )
}

export default HomePage