import axios from 'axios';
import React, { useState } from 'react'

const SubmitAttendance = (props) => {

    const students = props.students
    const presentStudents = props.presentStudents;
    const classname = props.classname;
    const t_id = props.t_id;
    const subCode = props.subCode;

    


    const [selectedRolls, setSelectedRolls] = useState(presentStudents);

    const axiosInstance = axios.create({
        withCredentials : true
    })

    const handleCheckboxChange = (roll) => {
        if (selectedRolls.includes(roll)) {
          setSelectedRolls(selectedRolls.filter((selectedRoll) => selectedRoll !== roll));
        } else {
          setSelectedRolls([...selectedRolls, roll]);
        }
    };

    const submitAttendance = () => {
        const att_data = {
            classid : classname,
            t_id : t_id,
            subCode : subCode,
            rolls : selectedRolls
        }
        axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/submitattendance`,{att_data : att_data}).then(res =>{
           if(res.data.success){
                alert('attendance  submitted successfully');
                window.location.reload();
           }
        }).catch(err => console.log(err))
    }


  return (
    <div id='submit-attendance-whole-div'>
        <div id='student-list-submit-div'>
            <div id='student-list'>
                {
                    students.map((student,index)=>(
                        <div key={index} className= {index%2 === 0 ? 'even-student indivisual-students' : 'odd-student indivisual-students'}>
                            <div>
                                {
                                    student.roll + " " + student.name
                                }
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedRolls.includes(parseInt(student.roll))}
                                onChange={() => handleCheckboxChange(parseInt(student.roll))}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
        <div className='button-div-submit'>
            <button id='submit-btn-at' onClick={submitAttendance}> SUBMIT </button>
        </div>
    </div>
  )
}

export default SubmitAttendance