import React, { useEffect, useState } from 'react'
import AddNewTeacher from './AddNewTeacher';
import ExistingTeacher from './ExistingTeacher';
import axios from 'axios';

const AdminManageTeacher = () => {

  const [option, setOption] = useState('####');
  const [temp, setTemp] = useState('####');
  const [id, setId] = useState('####')
  const [teachers, setTeachers] = useState([])

  const axiosInstance = axios.create({
    withCredentials : true
  })
  

  const addNewTeacherHandler = () =>{
      setOption('newteacher')
  }

  const selectTeacherHandler =(teacher) =>{
    setOption('existing')
    setId(teacher)
  }

  useEffect(()=>{
    axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/getteacher`).then(res =>{
        if(res.data.success){
          console.log([...res.data.teachers])
          setTeachers([...res.data.teachers].sort((a, b) => a.name.localeCompare(b.name)));
        }
    }).catch(err => console.log(err))
  },[temp])

  return (
    <div className='manage-class-main-div'>
        <div className='manage-class-class-list'>
            <div className='class-list-container'>
                <div className='add-new-class-btn-container'>
                    <button className='add-new-class-btn' onClick={addNewTeacherHandler}>
                        Add new Teacher +
                    </button>
                </div>
                {
                    teachers.length === 0 ? <div className='class-list-list'>
                                                <div className='no-class-alert'>
                                                    no Teacher still now
                                                </div>
                                            </div>
                                        :   <div className='class-list-list list'>
                                                {
                                                teachers.map((teacher,index) =>(
                                                        <div key={teacher._id} className = {index%2 === 0 ? 'even-claxx class-indivisual' : 'class-indivisual odd-class'} onClick={() => selectTeacherHandler(teacher._id)}>
                                                            {
                                                                teacher.name
                                                            }
                                                        </div>
                                                ))
                                                }
                                            </div>
                }
            </div>
        </div>
        <div className='manage-class-details'>
            {
                option === 'newteacher' ? <AddNewTeacher temp = {temp} setTemp = {setTemp}/>
                                    
                : option === 'existing' ?  <ExistingTeacher id = {id}/>
                                                    
                                                
                :   <div>
                        this page is for managing the Teachers
                    </div>
            }
        </div>
    </div>
  )
}

export default AdminManageTeacher