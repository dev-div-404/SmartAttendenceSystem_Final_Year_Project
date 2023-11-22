import mongoose from "mongoose";

const ClassSchema = mongoose.Schema({
    admin : {
        type : String,
        required : true,
    },
    classid : {
        type :String,
        required: true
    },
    classdesc : {
        type :String,
    }
})

export default mongoose.model('class',ClassSchema);