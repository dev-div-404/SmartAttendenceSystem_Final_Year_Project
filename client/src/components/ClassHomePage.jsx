import React, { useEffect, useState } from 'react'
import axios from 'axios';

const ClassHomePage = (props) => {
  const classid = props.classid;

  const axiosInstance = axios.create({
    withCredentials : true,
  })

  const [classdesc,setClassdesc] = useState({});
  const [loading, setLoading] = useState(false); // Introduce loading state

  const trainModelHandler = async() => {
    setLoading(true); // Set loading state to true when training starts
    try {
      await axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/trainModel`,{classid : classid});
      alert('Model trained successfully');
      setLoading(false); // Set loading state to false when training completes
    } catch (error) {
      console.log(error);
      setLoading(false); // Set loading state to false if an error occurs during training
    }
  }

  useEffect(()=>{
    axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/getclassdetails`,{classid : classid}).then(res =>{
      if(res.data.success){
        setClassdesc({...res.data.classdesc});
      } else {
        alert(res.data.message);
      }
    }).catch(err => console.log(err))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[classid,loading])

  return (
    <div id='class-whole-div'>
      <div id='class-name-banner'>
        <div id='class-name'>
          {classid}
        </div>
      </div>
      <div id='class-desc-div'>
        <div id='class-description'>
          Description :: {classdesc.classdesc}
        </div>
      </div>
      <div id='number-of-student-div'>
        number of students : {classdesc.studentCount}
      </div>
      
      <div id='train-model-btn-container'>
        <div id='model-status'>
          (
            Model Status: {
              classdesc.modelTrained === 1 ?  'trained' :
              classdesc.modelTrained === 0 ? 'model training in progress' : 'model need to be trained'
            }
          )
        </div>
        <button id='train-model-btn' disabled={classdesc.modelTrained === 1 || loading} onClick={trainModelHandler}>
          {loading ? 'Training in progress...' : 'Train Model'}
        </button>
      </div>
    </div>
  )
}

export default ClassHomePage;
