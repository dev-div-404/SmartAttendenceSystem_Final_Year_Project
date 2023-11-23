import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TeacherLogin = () => {

    const axiosInstance = axios.create({
        withCredentials : true
    })

    const navigate = useNavigate()

    const [info, setInfo] = useState({
        id : '',
        password : ''
    })

    const infoChangeHandler = (event) =>{
        setInfo({ ...info, [event.target.name]: event.target.value });
    }

    const logInButtonClickHandle = () =>{
        if(info.id !== '' && info.password !== ''){
            axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/teacherlogin`,info).then(res =>{
                if(res.data.success){
                    navigate(`/teacher/${info.id}`);
                }else{
                    alert(res.data.msg);
                }
            }).catch(err => console.log(err))
        }else alert('fill all the fields')
    }


    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/isteacher`).then(res =>{
            if(res.data.loggedin){
                navigate(`/teacher/${res.data.teacher}`);
            }
        }).catch(err => console.log(err))
    },[])


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