import React, { useState } from 'react'

const AdminNavbar = (props) => {

  const adminid = props.id;
  const option = props.option;
  const setOption = props.setOption;
  
  const changeOptionHandler = (opt) =>{
    setOption(opt);
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
              className={ option === 'admin' ? 'nav-bar-opt navbar-selected-opt' : 'nav-bar-opt'}
              onClick={() => changeOptionHandler('admin')}
            >
                Manage Admins
            </div>
        </div>
        <div className='nabbar-user-div'>
            <div>
              {adminid}
            </div>
            <div  className='log-out-btn'>
              logout
            </div>
        </div>
    </div>
  )
}

export default AdminNavbar