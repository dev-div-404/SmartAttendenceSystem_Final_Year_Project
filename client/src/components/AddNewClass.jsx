import React, { useState } from 'react'

const AddNewClass = (props) => {

    const [classinfo, setClassinfo] = useState({
        classid : '',
        classdesc : ''
    });

    const addClassBtnHandler = (event) =>{
        event.preventDefault();
        console.log(classinfo);
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