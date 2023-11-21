import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {

    const navigate = useNavigate();

    const [info, setInfo] = useState({
        id : '',
        password : ''
    })

    const infoChangeHandler = (event) =>{
        setInfo({ ...info, [event.target.name]: event.target.value });
    }

    const logInButtonClickHandle = () =>{
        if(info.id !== '' && info.password !== ''){
            navigate(`/admin/${info.id}`)
        }else alert('fill all the fields')
    }

  return (
    <div className='home-page-main-div'>
        <div className='login-form-banner'>
            <h3>Admin Log-in</h3>
                <input type='text' required placeholder='Admin id' name='id'value={info.id} onChange={infoChangeHandler}/>
                <input type='password' required placeholder='passcode' name='password' value={info.password} onChange={infoChangeHandler}/>
                <button onClick={logInButtonClickHandle}>login</button>
        </div>
    </div>
  )
}

export default AdminLogin