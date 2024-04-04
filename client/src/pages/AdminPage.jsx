import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar';
import AdminManageClass from '../components/AdminManageClass';
import AdminManageTeacher from '../components/AdminManageTeacher';
import AdminManageAdmin from '../components/AdminManageAdmin';
import axios from 'axios';

const AdminPage = () => {

    const axiosInstance = axios.create({
      withCredentials : true,
    })

    const navigate = useNavigate();

    const { id } = useParams();
    const [option, setOption] = useState('class');

    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/getadmin`).then(res =>{
            if(!res.data.loggedin){
              navigate('/adminlogin')
            }
        }).catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  return (
    <div className='admin-page-main-div'>
        <div className='navbar-container'>
            <AdminNavbar id = {id} option = {option} setOption = {setOption}/>
        </div>
        <div className='selected-view-div'>
        {
            option === 'class' ? <AdminManageClass />
            : option === 'teacher' ? <AdminManageTeacher />
            : option === 'admin' ? <AdminManageAdmin />
            : null
        }
        </div>
    </div>
  )
}

export default AdminPage