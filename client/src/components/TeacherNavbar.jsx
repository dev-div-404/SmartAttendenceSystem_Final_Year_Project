import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TeacherNavbar = (props) => {

  const t_name = props.name;
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const logoutHandler = ()=>{
    axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/teacherlogout`).then(res =>{
        if(res.data.success){
          navigate('/teacherlogin');
        }
     }).catch(err => console.log(err))
  }

  return (
    <div className='navbar-main-div teacher-navbar'>
        <div className='nabbar-user-div'>
            <div>
              {t_name}
            </div>
            <div  className='log-out-btn' onClick={logoutHandler}>
              logout
            </div>
        </div>
    </div>
  )
}

export default TeacherNavbar