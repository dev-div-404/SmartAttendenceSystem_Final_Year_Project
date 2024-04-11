import React, { useEffect, useState } from 'react'
import AddNewStudent from './AddNewStudent';
import ExistingStudent from './ExistingStudent';
import axios from 'axios';
import ClassHomePage from './ClassHomePage';

const ExistingClasses = (props) => {

  const classid = props.classid;

  const [students, setStudents] = useState([]);
  const [temp, setTemp] = useState(0);

  const [stoption, setstOption] = useState('####');
  const [studentid, setStudentid] = useState('####');

  const axiosInstance = axios.create({
    withCredentials : true,
  })

  const changeToAddStudentOptionHandler = () =>{
    setstOption('addstudent');
  }

  const changeToExistingStudentOptionHandler = (id) =>{
    setstOption('####');
    setstOption('existingstudent');
    setStudentid(id);
  }

  useEffect(()=>{
    setstOption('####');
    setStudentid('####');

    axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getstudents`,{classid : classid}).then(res =>{
        if(res.data.success){
            setStudents([...res.data.students].sort((a, b) => a.roll - b.roll ));
        }else{
            alert('Could not fetch students');
        }
    }).catch(err => console.log(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[classid, temp])



  return (
    <div className='classroom-main-div'>
        <div className='student-list-container'>
          <div className='student-list-div'>
              <div className='add-student-container'>
                  <button onClick={changeToAddStudentOptionHandler}>
                      Add New Student
                  </button>
              </div>
              {
                  students.length === 0 ? <div className='student-list-container-list'>
                                              No Students Still Now
                                          </div>
                  : <div className='student-list-container-list'>
                        {
                            students.map((student,index)=>(
                              <div key={index} className= {index%2 === 0 ? 'even-student indivisual-student' : 'odd-student indivisual-student'} onClick={()=>changeToExistingStudentOptionHandler(student._id)}>
                                  {
                                    student.roll + " " + student.name
                                  }
                              </div>
                            ))
                        }
                    </div>
              }
          </div>
        </div>
        <div className='option-container-student'>
              {
                  stoption === 'addstudent' ? <AddNewStudent classid = {classid} setTemp = {setTemp} temp = {temp}/>
                  :  stoption === 'existingstudent' ? <ExistingStudent student = {studentid} setTemp = {setTemp} temp = {temp} setStudentid = {setStudentid} setstOption = {setstOption}/>
                  : <ClassHomePage classid = {classid}/>
              }
        </div>
    </div>
  )
}

export default ExistingClasses