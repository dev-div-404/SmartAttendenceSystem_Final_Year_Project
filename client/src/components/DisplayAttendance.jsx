import axios from 'axios';
import React, { useState } from 'react'

const DisplayAttendance = () => {

    const [classid, setClassid] = useState('');
    const [subCode, setSubCode] = useState('');
    const [attendance, setAttendance] = useState([]);

    const axiosInstance = axios.create({
        withCredentials : true
    })

    const changeClassHandler = (event) => {
        setClassid(event.target.value);
    }

    const changeSubCodeHandler = (event) => {
        setSubCode(event.target.value);
    }

    const fetchAttendanceHandler = () => {
        if(classid === '') alert('fill Class Id first')
        else{
            axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getclassinfo`,{classid : classid}).then(res =>{
                if(res.data.valid){
                    let criteria = {}
                    if(subCode === ''){
                        criteria = {
                            classid : classid
                        }
                    }else criteria = {
                        classid : classid,
                        subCode : subCode
                    }
                    axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getattendance`,{criteria : criteria}).then(res =>{
                        if(res.data.result){
                            setAttendance(res.data.result);
                            console.log(res.data.result);
                        }else{  
                            alert('could not fetch result');
                        }
                    })
                }else{  
                    alert('invalid class id');
                }
            }).catch(err => console.log(err))
        }
    }

  return (
    <div id='display-attendance'>
        <div id='criteria-container'>
            <div id='criteria-all-div'>
                <input type='text' placeholder='Class Id' id='cls-id-field' onChange={changeClassHandler}/>
                <input type='text' placeholder='Subject Code' id='cls-id-field' onChange={changeSubCodeHandler}/>
                <button onClick={fetchAttendanceHandler}>Fetch</button>
            </div>
        </div>
        <div id='attendance-list-container'>
            <div id='attendance-list'>
                {
                    attendance.length === 0 ? 'No Attendance Record Found!' 
                    : 
                    <div id='student-list att-list'>
                    {
                        attendance.map((entry,index)=>(
                            entry.roll !== 0 ?
                                <div key={index} className= {index%2 === 0 ? 'even-student indivisual-students row' : 'odd-student indivisual-students row'}>
                                    <div style={{width : '10%'}}>
                                        {
                                            entry.classid
                                        }
                                    </div>
                                    <div style={{width : '10%'}}>
                                        {
                                            entry.subCode
                                        }
                                    </div>
                                    <div style={{width : '10%'}}>
                                        {
                                            entry.roll
                                        }
                                    </div>
                                    <div style={{width : '30%'}}>
                                        {
                                            entry.name
                                        }
                                    </div>
                                    <div style={{width : '20%'}}>
                                        {
                                            entry.t_id
                                        }
                                    </div>
                                    <div style={{width : '20%'}}>
                                        {
                                            entry.date
                                        }
                                    </div>
                                </div> : null
                        ))
                    }
            </div>
                }
            </div>
        </div>
    </div>
  )
}

export default DisplayAttendance