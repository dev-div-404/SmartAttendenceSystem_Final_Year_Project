import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TeacherNavbar from '../components/TeacherNavbar';
import axios from 'axios';
import TeacherPageBody from '../components/TeacherPageBody';


const TeacherPage = () => {
    const { id } = useParams();

    const axiosInstance = axios.create({
        withCredentials : true,
      })

      const navigate = useNavigate();

    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/isteacher`).then(res =>{
            if(!res.data.loggedin){
              navigate('/teacherlogin')
            }
        }).catch(err => console.log(err))
    },[])

  return (
    <div>
        <TeacherNavbar id = {id}/>
        <TeacherPageBody />
    </div>
  )
}

export default TeacherPage