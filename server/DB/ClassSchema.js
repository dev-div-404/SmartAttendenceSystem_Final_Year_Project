import mongoose from "mongoose";

const ClassSchema = mongoose.Schema({
    admin : {
        type : String,
        required : true,
    },
    classid : {
        type : String,
        required: true
    },
    classdesc : {
        type : String,
    },
    modelTrained : {
        type : Number,
        default : -1 //-1 means not trained yet; 0 means training in progress; 1 means training succeeded
    },
    studentCount : {
        type : Number,
        default : 0
    }
})

export default mongoose.model('class',ClassSchema);