import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import AdminNavbar from '../components/AdminNavbar';

const AdminPage = () => {

    const { id } = useParams();
    const [option, setOption] = useState('class');

  return (
    <div className='admin-page-main-div'>
        <AdminNavbar id = {id} option = {option} setOption = {setOption}/>
    </div>
  )
}

export default AdminPage