import React, { useState } from 'react'
import axios from 'axios'

const AddNewClass = (props) => {

    const temp = props.temp;
    const setTemp = props.setTemp;

    const [classinfo, setClassinfo] = useState({
        classid : '',
        classdesc : ''
    });

    const axiosInstance = axios.create({
        withCredentials : true,
    })

    const addClassBtnHandler = (event) =>{
        event.preventDefault();
        axiosInstance.post(`${process.env.REACT_APP_SERVER_URI}/addclass`,classinfo).then(res =>{
            if(res.data.success){
                setTemp(temp+1);
                setClassinfo({
                    classid : '',
                    classdesc : ''
                })
            }else{
                alert('can not add class')
            }
        }).catch(err => console.log(err))
    }

    const changeHandler = (event) =>{
        setClassinfo({...classinfo, [event.target.name] : event.target.value});
    }

  return (
    <div className='add-new-class-main-div'>
        <div className='add-new-class-container'>
            <div className='add-new-class-form-container'>
                <form className='add-class-form'>
                    <input type='text' placeholder='class id' value={classinfo.classid} onChange={changeHandler} name='classid'/>
                    <textarea placeholder='class description' value={classinfo.classdesc} onChange={changeHandler} name='classdesc'/>
                    <button className='add-class-btn' onClick={addClassBtnHandler} >
                        Add Class
                    </button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddNewClass