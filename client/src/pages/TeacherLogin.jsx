import React, { useState } from 'react'

const TeacherLogin = () => {


    const [info, setInfo] = useState({
        id : '',
        password : ''
    })

    const infoChangeHandler = (event) =>{
        setInfo({ ...info, [event.target.name]: event.target.value });
    }

    const logInButtonClickHandle = () =>{
        if(info.id !== '' && info.password !== ''){
            console.log(info);
        }else alert('fill all the fields')
    }

  return (
    <div className='home-page-main-div'>
        <div className='login-form-banner'>
            <h3>Teacher Log-in</h3>
                <input type='text' required placeholder='Teacher id' name='id'value={info.id} onChange={infoChangeHandler}/>
                <input type='password' required placeholder='passcode' name='password' value={info.password} onChange={infoChangeHandler}/>
                <button onClick={logInButtonClickHandle}>login</button>
        </div>
    </div>
  )
}

export default TeacherLogin