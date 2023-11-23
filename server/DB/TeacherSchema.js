import mongoose from "mongoose";

const TeacherSchema = mongoose.Schema({
    name :{
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    },
    pw : {
        type : String,
        required : true
    }

})

export default mongoose.model('teachers',TeacherSchema);