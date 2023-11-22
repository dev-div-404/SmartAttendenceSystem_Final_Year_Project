import React, { useState } from 'react'
import AddNewClass from './AddNewClass';
import ExistingClasses from './ExistingClasses';

const AdminManageClass = () => {

    const classes = ['class1','class2','class3','class4','class5','class6','class1','class2','class3','class4','class5','class6','class1','class2','class3','class4','class5','class6'].sort();

    const [option, setOption] = useState('####');
    const [classid, setClassId] = useState('####');


    const addNewClassHandler = () =>{
        setOption('newclass');
    }

    const selectClassHandler = (classname) =>{
        setOption('existingclass');
        setClassId(classname);
    }

  return (
    <div className='manage-class-main-div'>
        <div className='manage-class-class-list'>
            <div className='class-list-container'>
                <div className='add-new-class-btn-container'>
                    <button className='add-new-class-btn' onClick={addNewClassHandler}>
                        Add new Class +
                    </button>
                </div>
                <div className='class-list-list'>
                    {
                       classes.map((myclass,index) =>(
                            <div key={index} className = {index%2 === 0 ? 'even-claxx class-indivisual' : 'class-indivisual odd-class'} onClick={() => selectClassHandler(myclass)}>
                                {
                                    myclass
                                }
                            </div>
                       ))
                    }
                </div>
            </div>
        </div>
        <div className='manage-class-details'>
            {
                option === 'newclass' ? <AddNewClass />
                                    
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