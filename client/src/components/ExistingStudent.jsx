import React from 'react'

const ExistingStudent = (props) => {
    const student = props.student;
  return (
    <div>
        ExistingStudent {student._id}
    </div>
  )
}

export default ExistingStudent