import axios from 'axios';
import React, { useEffect, useState } from 'react'

const TeacherPageBody = () => {

    const axiosInstance = axios.create({
        withCredentials : true
    })

    const [classid, setClassid] = useState('');
    const [classname, setClassname] = useState(null);
    const [students, setStudents] = useState([]);

    const classidChangeHandler = (event) =>{
        setClassid(event.target.value);
    }

    const fetchClassDetails = () =>{
        axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getclassinfo`,{classid : classid}).then(res =>{
            if(res.data.valid){
                setClassname(classid);
            }else{  
                alert('invalid class id');
            }
        }).catch(err => console.log(err))
    }

    useEffect(()=>{
        axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getstudents`,{classid : classid}).then(res =>{
            if(res.data.success){
                setStudents([...res.data.students].sort((a, b) => a.roll - b.roll ));
            }else{
                alert('Could not fetch students');
            }
        }).catch(err => console.log(err))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[classname])

  return (
    <div className='teacher-page-body'>
        <div className='teacher-side-bar'>
            <div className='list-teacher-container'>
                <div className='input-field'>
                    <input type='text' placeholder='Class ID' value={classid} onChange={classidChangeHandler}/>
                    <button onClick={fetchClassDetails}>
                        browse
                    </button>
                </div>
                {
                    classname ? <div className='btn-container'>
                                    <button className='start-stop-btn start-btn'>Start Attendence</button>
                                    <button className='start-stop-btn stop-btn'>Stop Attendence</button>
                                </div>
                            :   null
                }
                {
                    classname ? <div className='student-liat-container'>
                                    {
                                        students.length === 0 ? <div className='student-list-container-list'>
                                                                    No Students Still Now
                                                                </div>
                                        : <div className='student-list-container-list'>
                                                {
                                                    students.map((student,index)=>(
                                                    <div key={index} className= {index%2 === 0 ? 'even-student indivisual-student' : 'odd-student indivisual-student'}>
                                                        {
                                                            student.roll + " " + student.name
                                                        }
                                                    </div>
                                                    ))
                                                }
                                            </div>
                                    }
                                </div>
                            : null
                }
            </div>
        </div>

        {
            classname ? <div className='teacher-attendence-body'>
                            <div className='camera-video-display'>
                                <div className='video-text'>
                                    V i d e o
                                </div>
                            </div>
                        </div>
                    : null
        }
    </div>
  )
}

export default TeacherPageBody