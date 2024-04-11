import axios from 'axios';
import React, { useEffect, useState } from 'react'

const ExistingStudent = (props) => {

  const student = props.student;
  const setTemp = props.setTemp;
  const temp = props.temp;
  const setStudentid = props.setStudentid;
  const setstOption = props.setstOption;
  
  const axiosInstance = axios.create({
    withCredentials : true,
  })

  const [images, setImages] = useState([]);
  const [studentData, setStudentData] = useState({});

  const deleteStudentBtnHandler = () => {
    axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/deleteStudent`,{id : student})
    .then(res => {
      if(res.data.success){
        alert(res.data.msg);
        setstOption('####')
        setStudentid('####');
        setTemp(temp+1);
      }
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });
  }
  

  useEffect(() => {
    axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getStudentData`,{id : student})
    .then(res => {
      setImages(res.data.images);
      setStudentData({...res.data.studentData});
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });
  }, [student]);

  return (
    <div>
      <div className='student-details-panel'>
          <div className='student-name-roll'>
              <div>
                Class : {studentData.classid}
              </div>
              <div id='studentName'>
                Name : {studentData.name}
              </div>
              <div id='studentRollNo'>
                Roll No : {studentData.roll}
              </div>
          </div>
          <div className='student-delete-div'>
              <button id='delete-student-btn' onClick={deleteStudentBtnHandler}>delete Student</button>
          </div>
      </div>
      <div className='student-images'>
          {images.map(image => (
              <div className='image-student'>
                <img key={image._id} src={`data:image/jpeg;base64,${image.data}`} alt="student image" />
              </div>
          ))}
      </div>
    </div>
  )
}

export default ExistingStudent