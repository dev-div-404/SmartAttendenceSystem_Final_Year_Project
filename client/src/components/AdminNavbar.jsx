import React from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminNavbar = (props) => {

  const adminid = props.id;
  const option = props.option;
  const setOption = props.setOption;

  const navigate = useNavigate();

  const axiosInstance = axios.create({
    withCredentials: true,
  });
  
  const changeOptionHandler = (opt) =>{
    setOption(opt);
  }

  const logoutHandler = ()=>{
    axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/adminlogout`).then(res =>{
        if(res.data.success){
          navigate('/');
        }
     }).catch(err => console.log(err))
  }

  return (
    <div className='navbar-main-div'>
        <div className='navbar-options'>
            <div
              className={ option === 'class' ? 'nav-bar-opt navbar-selected-opt' : 'nav-bar-opt'}
              onClick={() => changeOptionHandler('class')}
            >
                Manage Classes
            </div>
            <div
              className={ option === 'teacher' ? 'nav-bar-opt navbar-selected-opt' : 'nav-bar-opt'}
              onClick={() => changeOptionHandler('teacher')}
            >
                Manage Teachers
            </div>
            <div
              className={ option === 'attendance' ? 'nav-bar-opt navbar-selected-opt' : 'nav-bar-opt'}
              onClick={() => changeOptionHandler('attendance')}
            >
                Display Attendance
            </div>
        </div>
        <div className='nabbar-user-div'>
            <div>
              {adminid}
            </div>
            <div  className='log-out-btn' onClick={logoutHandler}>
              logout
            </div>
        </div>
    </div>
  )
}

export default AdminNavbar