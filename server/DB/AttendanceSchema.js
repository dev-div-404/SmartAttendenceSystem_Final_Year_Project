import mongoose from "mongoose";

const AttendanceSchema = mongoose.Schema({
    classid : {
        type : String,
        required : true,
    },
    t_id : {
        type : String,
        required: true
    },
    subCode : {
        type : String,
        required : true
    },
    roll : {
        type : Number,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    }
})

export default mongoose.model('attendance',AttendanceSchema);