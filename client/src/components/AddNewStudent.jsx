import React, { useEffect, useState } from 'react'
import axios from 'axios'

const AddNewStudent = (props) => {

    const classid = props.classid;
    const setTemp = props.setTemp;
    const temp = props.temp;

    const axiosInstance = axios.create({
        withCredentials : true,
    })
    

    const [info, setInfo] = useState({
        classid : classid,
        name : '',
        roll : ''
    })

    const changeInfoHandler = (event) =>{
        setInfo({
            ...info,
            [event.target.name] : event.target.value,
        })
    }

    const sddStudentButtonHandler = (event) =>{
        event.preventDefault();
        console.log(info)
        if(info.name === '' || info.roll === ''){
            alert('fill all the forms');
        }else{
            axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/addstudent`,info).then(res =>{
                if(res.data.success){
                    setInfo({
                        classid : classid,
                        name : '',
                        roll : ''
                    })
                    setTemp(temp+1);
                }else{
                    alert('Could not add new Student');
                }
            }).catch(err => console.log(err))
        }
    }


    useEffect(()=>{
        
    })


  return (
    <div className='add-student-main-div'>
        <div className='add-student-container-new'>
            <div className='add-student-form-container'>
                <form className='add-student-form'>
                    <div className='basic-info-new-student'>
                        <input readOnly value={info.classid} className='student-add-classid'/>
                        <input required value={info.name} name='name' type ='text' onChange={changeInfoHandler} placeholder='Name'/>
                        <input required value={info.roll} name='roll' type='text' onChange={changeInfoHandler} placeholder='Roll'/>
                    </div>
                    <div className='record-video-div-container'>
                        {/* <RecordVideo onVideoRecorded={handleVideoRecorded} /> */}
                    </div>
                    <div className='add-stdnt-btn'>
                        <button onClick={sddStudentButtonHandler}>
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        
    </div>
  )
}

export default AddNewStudent