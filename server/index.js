import express from 'express';
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './DB/connDB.js'
import ClassModel from './DB/ClassSchema.js'
import StudentModel from './DB/StudentSchema.js';
import TeacherModel from './DB/TeacherSchema.js';
import AttendanceModel from './DB/AttendanceSchema.js';
import fs from 'fs'
import fse from 'fs-extra'
import path from 'path';
import { fileURLToPath } from 'url';
import { PythonShell } from 'python-shell';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    secure: false,
    credentials: true,
    methods: ['POST', 'GET']
}));


app.use(cookieParser())
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(
    session({
    secret: 'helloworld',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 *60 * 24,
    },
    })
);

dotenv.config(
    { path: './.env', }
)

connectDB();

const run_python_options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname,'pythonCodes'),
    pythonPath: path.join(__dirname,'pythonCodes','env','Scripts','python.exe'),
};

const saveImageLocally = async(classid, students) => {
    let folderPath = path.join(__dirname, 'data' , classid);
    await fse.remove(folderPath);
    fs.mkdirSync(folderPath);

    folderPath = path.join(folderPath,'students');
    fs.mkdirSync(folderPath);
    folderPath = path.join(folderPath,'original');
    fs.mkdirSync(folderPath);

    students.forEach(student => {
        const roll = student.roll;
        let folderPathStudent = './';
        folderPathStudent = path.join(folderPath, student.roll);
        if (!fs.existsSync(folderPathStudent)) {
            fs.mkdirSync(folderPathStudent);
        }
        // Save image to the local system
        const imagesBinary = student.images;
        imagesBinary.forEach((imageBuffer, index) => {
            // Save the image buffer as a PNG file
            let imagePath = path.join(folderPathStudent, `${index + 1}.png`);
            fs.writeFileSync(imagePath, imageBuffer.data);
        });
    });  
}

const saveCroppedFaces = async (classid) =>{
    await PythonShell.run('cropFacesAndSave.py', {...run_python_options, args : [classid]}, (err, result) => {
        if (err) {
            console.error('Python execution error:', err);
        } else {
            console.log('cropped images saved');
        }
    });
}

const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const extract_face_features = async (classid) =>{
    await PythonShell.run('extract_face_features_to_csv_by_classid.py', {...run_python_options, args : [classid]}, (err, result) => {
        if (err) {
            console.error('Python execution error:', err);
        } else {
            console.log('cropped images saved');
        }
    });
}

const createAttendanceTempFiles = async(classid,teacher) => {
    const temp_file_dir_path = path.join(__dirname, 'data', classid, 'temp_files');
    if (fs.existsSync(temp_file_dir_path)){
        return;
    }
    
    fse.ensureDirSync(temp_file_dir_path);
    const attendance_data_path = path.join(temp_file_dir_path, 'attendance_data.json');
    const data = { teacher : teacher, total: 0 };
    fs.writeFile(attendance_data_path, JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
}

const removeTempFiles = (classid) => {
    const temp_file_dir_path = path.join(__dirname, 'data', classid, 'temp_files');
    if (fs.existsSync(temp_file_dir_path)){
        fse.remove(temp_file_dir_path).then(() => {
                console.log('Folder deleted successfully');
            })
            .catch((err) => {
                console.error('Error deleting folder:', err);
            });
    }
}

const saveAttendanceImage = async(imgData, classid) => {
    const base64Image = Buffer.from(imgData.split(',')[1], 'base64');
    const fileName = path.join(__dirname, 'data', classid, 'temp_files', 'attendance_image.png');
    fs.writeFile(fileName, base64Image, (err) => {
        if (err) {
            console.error('Error saving image:', err);
            throw err;
        }
    });
};

const runAttendanceModel = async (classid) => {
    await PythonShell.run('takeAttendance.py', {...run_python_options, args : [classid]}, (err, result) => {
        if (err) {
            console.error('Python execution error:', err);
        } else {
            console.log('cropped images saved');
        }
    });
}

const getTempAttandanceData = async(classid) => {
    let dataPath = path.join(__dirname, 'data', classid, 'temp_files', 'attendance_data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
        
        // Parse JSON
        const jsonData = JSON.parse(data);

        const total = jsonData.total;
        
        let res = []
        // Traverse through keys
        Object.keys(jsonData).forEach(key => {
            if(key != 'total' || key != 'teacher')
                if(jsonData[key] >= total / 2)
                    res.push(key);
        });
        console.log(res)
        return  res;
      });
}



app.post('/adminlogin',(req,res)=>{
    const id = req.body.id;
    const password = req.body.password;
    if(id === process.env.ADMIN_USER_NAME && req.body.password === process.env.ADMIN_PASSWORD){
        req.session.admin = process.env.ADMIN_USER_NAME;
        console.log('admin logged in :: '+req.session.admin);
        res.status(200).json({ success : true });
    }else{
        res.status(200).json({ success : false });
    }
})

app.post('/addclass',async(req,res)=>{
    try{
        await ClassModel.create({ admin : req.session.admin, classid : req.body.classid, classdesc : req.body.classdesc });
        res.status(200).json({success : true});
    }catch(err){
        console.log(err);
        res.status(200).json({success : false});
    }
})

app.post('/addstudent',async(req,res)=>{
    if(req.session.admin){
        try{
            const classid = req.body.info.classid;
            const name = req.body.info.name;
            const roll = req.body.info.roll;
            const images = req.body.images;

            const duplicate = await StudentModel.findOne({classid : classid, roll : roll});
            if(duplicate){
                res.status(200).json({success : false, duplicate : true});
                return;
            }

            const imagesBinary = await images.map(imageData => Buffer.from(imageData.split(',')[1], 'base64'));

            await StudentModel.create({
                classid : classid,
                name : name,
                roll : roll,
                images : imagesBinary.map(data => ({ data, contentType: 'image/png' }))
            });

            const updatedClass = await ClassModel.findOneAndUpdate(
                { classid: classid },
                {
                    $set: { modelTrained: -1 },
                    $inc: { studentCount: 1 },
                },
                { new: true } // Return the updated document
            );

            res.status(200).json({success : true});
        }catch(err){
            console.log(err);
            res.status(200).json({success : false});
        }
    }else{
        res.status(200).json({success : false});
    }
})

app.post('/addteacher',async(req,res)=>{
    if(req.session.admin){
        try{
            const id = req.body.id;

            const teacher = await TeacherModel.findOne({id : id})
            if(teacher){
                res.status(200).json({success : false, msg : 'id already exists'});
            }else{   
                TeacherModel.create(req.body);
                res.status(200).json({success : true, msg : 'Teacher Created'});
            }
        }catch(err){
            console.log(err);
            res.status(200).json({success : false,msg : 'Session Expired'});
        }
    }else{
        res.status(200).json({success : false});
    }
})

// take attendence
app.post('/takeattendence',async(req,res)=>{
    const classid = req.body.classid;
    const t_id = req.body.t_id;
    const image = req.body.image;

    //creating the temp_file_dir if not exist
    await createAttendanceTempFiles(classid, t_id);

    await saveAttendanceImage(image,classid);
    await runAttendanceModel(classid);

    let dataPath = path.join(__dirname, 'data', classid, 'temp_files', 'attendance_data.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
        const jsonData = JSON.parse(data);
        const total = jsonData.total;
        
        let result = []
        Object.keys(jsonData).forEach(key => {
            if(key !== 'total' && key !== 'teacher')
                if(jsonData[key] >= total / 2)
                    result.push(parseInt(key));
        });
        res.status(200).json({ present : result });
    });
    
})


app.post('/submitattendance', async (req, res) => {
    const attendanceData = req.body.att_data;
    attendanceData.rolls.push(0);
    const date = getCurrentDate();
    try {
        for (const roll of attendanceData.rolls) {
            const st = await StudentModel.findOne({ classid: attendanceData.classid, roll: roll });
            if (st) {
                const attendanceRecord = new AttendanceModel({
                    classid: attendanceData.classid,
                    t_id: attendanceData.t_id,
                    subCode: attendanceData.subCode,
                    roll: roll,
                    name: st.name,
                    date: date
                });
                await attendanceRecord.save();
            } else {
                if(roll !== 0)
                    console.error(`Student with roll ${roll} not found`);
            }
        }
        console.log('Attendance marked successfully by ' + attendanceData.t_id + ' at ' + attendanceData.classid);
        await removeTempFiles(attendanceData.classid);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.post('/teacherlogin',async(req,res)=>{
    const id = req.body.id;
    const pass = req.body.password;

    const teacher = await TeacherModel.findOne({id : id});
    if(teacher){
        if(teacher.pw === pass){
            req.session.teacher = teacher.id;
            req.session.teacher_name = teacher.name;
            res.status(200).json({ success : true });
        }else{
            res.status(200).json({ success : false, msg : 'incorrect Password' });
        }
    }else{
        res.status(200).json({ success : false, msg : 'no teacher found' });
    }

})


app.post('/getattendance',async(req,res)=>{
    const criteria = req.body.criteria;
    // console.log(criteria);
    const result = await AttendanceModel.find(criteria).exec();
    res.json({result : result}).status(200);
})

app.get('/isteacher',(req,res)=>{
    if(req.session.teacher){
        res.status(200).json({ loggedin : true, teacher : req.session.teacher ,name : req.session.teacher_name})
    }else{
        res.status(200).json({ loggedin : false })
    }
})
//get indivisual student data
app.post('/getStudentData', async (req, res) => {
    try {
        const stId = req.body.id;
        const studentData = await StudentModel.findOne({ _id: stId }).select('classid roll name images').exec();
        if (!studentData) {
            return res.status(404).json({ success: false, msg: "Student not found" });
        }
        const imageData = studentData.images.map(image => ({
            data: Buffer.from(image.data).toString('base64'),
            contentType: image.contentType
        }));
        delete studentData.images;
        res.status(200).json({ success: true, images: imageData, studentData: studentData });
    } catch (error) {
        console.error('Error fetching student data:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

//train the model
app.post('/trainModel', async (req, res) => {
    const classid = req.body.classid;

    await ClassModel.findOneAndUpdate(
        { classid: classid },
        { $set: { modelTrained: 0 } },
    );

    const students = await StudentModel.find({classid : classid}).exec();
    //saving the data locally in the Data folder
    await saveImageLocally(classid,students);
    await saveCroppedFaces(classid);
    await extract_face_features(classid);

    await ClassModel.findOneAndUpdate(
        { classid: classid },
        { $set: { modelTrained: 1 } },
    );

    res.status(200).json({success : true});
});

app.post('/deleteStudent', async (req, res) => {
    try {
        const stId = req.body.id;

        const student = await StudentModel.findOne({ _id: stId }).select('classid');
        const classid = student.classid;

        const status = await StudentModel.deleteOne({ _id: stId });

        if (status.deletedCount > 0) {
            const updatedClass = await ClassModel.findOneAndUpdate(
                { classid: classid },
                {
                    $set: { modelTrained: -1 },
                    $inc: { studentCount: -1 },
                },
                { new: true } // Return the updated document
            );
            console.log('hello$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
            res.status(200).json({ success: true, msg: 'One student deleted' });
        } else {
            res.status(404).json({ success: false, msg: 'No student found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


app.post('/getclassdetails', async (req, res) => {
    try {
        const classid = req.body.classid;
        const classdesc = await ClassModel.findOne({classid : classid});
        if(classdesc){
            res.status(200).json({ success: true, classdesc : classdesc });
        }else{
            res.status(200).json({ success: false, msg : 'no class found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});



app.post('/getstudents',async(req,res)=>{
    if(req.session.admin || req.session.teacher){
        try{
            const students = await StudentModel.find({classid : req.body.classid}).select('classid roll name').exec();
            res.status(200).json({success : true , students : students});
        }catch(err){
            console.log(err);
            res.status(200).json({success : false});
        }
    }else{
        res.status(200).json({success : false});
    }
})

app.post('/getclassinfo',async(req,res)=>{
    const classid = req.body.classid;

    const classinfo = await ClassModel.findOne({classid : classid});
    if(classinfo){
        res.status(200).json({ valid : true });
    }else{
        res.status(200).json({ valid : false });
    }

})

app.get('/getadmin',(req,res)=>{
    if(req.session.admin){
        res.status(200).json({ loggedin : true, admin : req.session.admin })
    }else{
        res.status(200).json({ loggedin : false })
    }
})

app.get('/getteacher',  async (req,res)=>{
    if(req.session.admin){
        const teachers = await TeacherModel.find({}).exec();
        res.status(200).json({ success : true, teachers : teachers });
    }else{
        res.status(200).json({ msg : 'need to log in' })
    }
})


app.get('/getclass',async(req,res)=>{
    const classes = await ClassModel.find({}).exec();
    if(classes)
        res.status(200).json({ classes : classes, success : true });
    else res.status(200).json({ success : false })

})

app.get('/adminlogout',(req,res)=>{
    req.session.destroy();
    res.status(200).json({ success : true });
})

app.get('/teacherlogout',(req,res)=>{
    req.session.destroy();
    res.status(200).json({ success : true });
})
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})