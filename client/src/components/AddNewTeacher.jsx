import axios from 'axios'
import React, { useState } from 'react'

const AddNewTeacher = (props) => {

const temp = props.temp;
const setTemp = props.setTemp;


const axiosInstance = axios.create({
    withCredentials : true
})

const [info, setInfo] = useState({
    name : '',
    id : '',
    pw : '',
    cpw : ''
})

const sddTeacherButtonHandler = (event) =>{
    event.preventDefault();

    if(info.id === '' || info.pw === '' || info.name === '' || info.cpw === ''){
        alert('Fill All The Fields')
    }else if(info.pw !== info.cpw){
        alert('Password mismatch')
    }else{
        axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/addteacher`,info).then(res =>{
            if(res.data.success){
                setInfo({
                    name : '',
                    id : '',
                    pw : '',
                    cpw : ''
                })
                setTemp(temp+1);
            }
            alert(res.data.msg)
        }).catch(err => console.log(err))
    }
}

const changeInfoHandler = (event) =>{
    setInfo({
        ...info,
        [event.target.name] : event.target.value
    })
}


  return (
    <div className='add-student-main-div'>
        <div className='add-student-container-new'>
            <div className='add-student-form-container'>
                <form className='add-student-form'>
                    <div className='add-teacher-form'>
                        <input required value={info.name} name='name' type ='text' onChange={changeInfoHandler} placeholder='Name'/>
                        <input required value={info.id} name='id' type ='text' onChange={changeInfoHandler} placeholder='ID'/>
                        <input required value={info.pw} name='pw' type ='password' onChange={changeInfoHandler} placeholder='Passcode'/>
                        <input required value={info.cpw} name='cpw' type ='password' onChange={changeInfoHandler} placeholder='Confirm Passcode'/>
                    </div>
                    <div className='add-stdnt-btn'>
                        <button onClick={sddTeacherButtonHandler}>
                            Add Teacher
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        
    </div>
  )
}

export default AddNewTeacher