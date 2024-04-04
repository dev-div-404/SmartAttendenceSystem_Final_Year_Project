import React, { useEffect, useState } from 'react'
import AddNewClass from './AddNewClass';
import ExistingClasses from './ExistingClasses';
import axios from 'axios';

const AdminManageClass = () => {

    const axiosInstance = axios.create({
        withCredentials : true,
    })

    const [classes, setClasses] = useState([]);
    const [option, setOption] = useState('####');
    const [classid, setClassId] = useState('####');
    const [temp, setTemp] = useState('####');

    const addNewClassHandler = () =>{
        setOption('newclass');
    }

    const selectClassHandler = (classname) =>{
        setOption('existingclass');
        setClassId(classname);
    }

    useEffect(()=>{
        axiosInstance.get(`${process.env.REACT_APP_SERVER_URI}/getclass`).then(res =>{
            if(res.data.success){
              setClasses([...res.data.classes].sort((a, b) => a.classid.localeCompare(b.classid)));
            }
         }).catch(err => console.log(err))
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[temp])



  return (
    <div className='manage-class-main-div'>
        <div className='manage-class-class-list'>
            <div className='class-list-container'>
                <div className='add-new-class-btn-container'>
                    <button className='add-new-class-btn' onClick={addNewClassHandler}>
                        Add new Class +
                    </button>
                </div>
                {
                    classes.length === 0 ? <div className='class-list-list'>
                                                <div className='no-class-alert'>
                                                    no classes still now
                                                </div>
                                            </div>
                                        :   <div className='class-list-list'>
                                                {
                                                classes.map((myclass,index) =>(
                                                        <div key={myclass._id} className = {index%2 === 0 ? 'even-claxx class-indivisual' : 'class-indivisual odd-class'} onClick={() => selectClassHandler(myclass.classid)}>
                                                            {
                                                                myclass.classid
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
                option === 'newclass' ? <AddNewClass temp = {temp} setTemp = {setTemp}/>
                                    
                : option === 'existingclass' ?  <ExistingClasses classid = {classid}/>
                                                    
                                                
                :   <div>
                        this page is for managing the classes
                    </div>
            }
        </div>
    </div>
  )
}

export default AdminManageClass