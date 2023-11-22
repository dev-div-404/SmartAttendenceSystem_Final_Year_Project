import React, { useState } from 'react'
import RecordVideo from './RecordVideo'

const AddNewStudent = (props) => {

    const classid = props.classid;

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
    }


  return (
    <div className='add-student-main-div'>
        <div className='add-student-container-new'>
            <div className='add-student-form-container'>
                <form className='add-student-form'>
                    <div className='basic-info-new-student'>
                        <input readOnly value={info.classid} className='student-add-classid'/>
                        <input value={info.name} name='name' type ='text' onChange={changeInfoHandler} placeholder='Name'/>
                        <input value={info.roll} name='roll' type='text' onChange={changeInfoHandler} placeholder='Roll'/>
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