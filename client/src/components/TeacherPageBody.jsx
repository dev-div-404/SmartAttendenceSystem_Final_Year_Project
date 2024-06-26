import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TeacherTakeAttendence from './TeacherTakeAttendence';
import present_icon from './present_icon.png'
import SubmitAttendance from './SubmitAttendance';

const TeacherPageBody = (props) => {

    const t_id = props.id;

    const axiosInstance = axios.create({
        withCredentials : true
    })

    const [classid, setClassid] = useState('');
    const [classname, setClassname] = useState(null);
    const [students, setStudents] = useState([]);
    const [presentStudents, setPresentStudents] = useState([]);
    const [option, setOption] = useState('take')
    const [subCode, setSubCode] = useState('');

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

    const isPresent = (roll) => {
        roll = parseInt(roll);
        if(presentStudents.includes(roll)) return true;
        return false;
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
                    classname ? <div className='student-liat-container'>
                                    {
                                        students.length === 0 ? <div className='student-list-container-list'>
                                                                    No Students Still Now
                                                                </div>
                                        : <div className='student-list-container-list'>
                                                {
                                                    students.map((student,index)=>(
                                                        <div key={index} className= {index%2 === 0 ? 'even-student indivisual-student' : 'odd-student indivisual-student'}>
                                                            <div>
                                                                {
                                                                    student.roll + " " + student.name
                                                                }
                                                            </div>
                                                            <div className='present-status'>
                                                                {
                                                                    (isPresent(student.roll) 
                                                                    ? <img src= {present_icon} alt = 'P' className='active-status'/>
                                                                    : null)
                                                                }
                                                            </div>
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
        <div className='teacher-workspace'>
            {
                classname ? option === 'take' ? <TeacherTakeAttendence classname = {classname} t_id = {t_id} setPresentStudents = {setPresentStudents} setOption = {setOption} subCode = {subCode} setSubCode = {setSubCode}/>
                                              : <SubmitAttendance students = {students} presentStudents = {presentStudents} classname = {classname} t_id = {t_id} setPresentStudents = {setPresentStudents} setOption = {setOption} subCode = {subCode} setStudents = {setStudents} setClassname = {setClassname}/>
                          : null
            }
        </div>
    </div>
  )
}

export default TeacherPageBody