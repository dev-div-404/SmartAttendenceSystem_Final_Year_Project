import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar';
import AdminManageClass from '../components/AdminManageClass';
import AdminManageTeacher from '../components/AdminManageTeacher';
import AdminManageAdmin from '../components/AdminManageAdmin';

const AdminPage = () => {

    const { id } = useParams();
    const [option, setOption] = useState('class');

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