import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    classid : {
        type : String,
        required : true,
    },
    name : {
        type :String,
        required: true
    },
    roll : {
        type :String,
        required : true
    },
    images : {
        type : [{
            data : Buffer,
            contentType : String,
        }],
        // required : true
    }
})

export default mongoose.model('students',StudentSchema);