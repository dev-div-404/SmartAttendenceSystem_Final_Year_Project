import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TeacherNavbar from '../components/TeacherNavbar';
import axios from 'axios';
import TeacherPageBody from '../components/TeacherPageBody';


const TeacherPage = () => {
    const { id } = useParams();
    const [name, setName] = useState('');

    const axiosInstance = axios.create({
        withCredentials : true,
      })

      const navigate = useNavigate();

    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/isteacher`).then(res =>{
            if(!res.data.loggedin){
              navigate('/teacherlogin')
            }else{
              setName(res.data.name);
            }
        }).catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div>
        <TeacherNavbar id = {id} name = {name}/>
        <TeacherPageBody id = {id}/>
    </div>
  )
}

export default TeacherPage