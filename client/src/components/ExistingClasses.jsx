import React, { useEffect, useState } from 'react'
import AddNewStudent from './AddNewStudent';
import ExistingStudent from './ExistingStudent';

const ExistingClasses = (props) => {

  const classid = props.classid;

  const students = ['student1','student2','student3','student4','student5','student6','student7','student8','student9','student9','student1','student1','student1','student1','student1','student1','student1','student1','student1','student1',]

  const [stoption, setstOption] = useState('####');
  const [studentid, setStudentid] = useState('####');

  const changeToAddStudentOptionHandler = () =>{
    setstOption('addstudent');
  }

  const changeToExistingStudentOptionHandler = (id) =>{
    setstOption('existingstudent');
    setStudentid(id);
  }

  useEffect(()=>{
    setstOption('####');
    setStudentid('####');
  },classid)



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
                  students.length === 0 ? <div>

                                          </div>
                  : <div className='student-list-container-list'>
                        {
                            students.map((student,index)=>(
                              <div key={index} className= {index%2 === 0 ? 'even-student indivisual-student' : 'odd-student indivisual-student'} onClick={()=>changeToExistingStudentOptionHandler(student)}>
                                  {
                                    student
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
                  stoption === 'addstudent' ? <AddNewStudent classid = {classid}/>
                  :  stoption === 'existingstudent' ? <ExistingStudent studentid = {studentid}/>
                  : <div>
                        {
                          classid
                        }
                    </div>
              }
        </div>
    </div>
  )
}

export default ExistingClasses