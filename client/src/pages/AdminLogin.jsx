import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminLogin = () => {

    const axiosInstance = axios.create({
        withCredentials: true,
    });

    const navigate = useNavigate();

    const [info, setInfo] = useState({
        id : '',
        password : ''
    })

    const infoChangeHandler = (event) =>{
        setInfo({ ...info, [event.target.name]: event.target.value });
    }

    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/getadmin`).then(res =>{
            if(res.data.loggedin){
                navigate(`/admin/${res.data.admin}`);
            }
        }).catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const logInButtonClickHandle = () =>{
        if(info.id !== '' && info.password !== ''){
            axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/adminlogin`,info).then(res =>{
                if(res.data.success){
                    navigate(`/admin/${info.id}`)
                }else{
                    alert('Wrong username or password');
                }
            }).catch(err => console.log(err))
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