import express from 'express';
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './DB/connDB.js'
import ClassModel from './DB/ClassSchema.js'
import StudentModel from './DB/StudentSchema.js';
import TeacherModel from './DB/TeacherSchema.js'



const app = express()

app.use(cors({
    origin: 'http://localhost:3000',
    secure: false,
    credentials: true,
    methods: ['POST', 'GET']
}));

app.use(cookieParser())
app.use(bodyParser.json())

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
            StudentModel.create(req.body);
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

app.post('/teacherlogin',async(req,res)=>{
    const id = req.body.id;
    const pass = req.body.password;

    const teacher = await TeacherModel.findOne({id : id});
    if(teacher){
        if(teacher.pw === pass){
            req.session.teacher = teacher.id;
            res.status(200).json({ success : true });
        }else{
            res.status(200).json({ success : false, msg : 'incorrect Password' });
        }
    }else{
        res.status(200).json({ success : false, msg : 'no teacher found' });
    }

})

app.get('/isteacher',(req,res)=>{
    if(req.session.teacher){
        res.status(200).json({ loggedin : true, teacher : req.session.teacher })
    }else{
        res.status(200).json({ loggedin : false })
    }
})


app.post('/getstudents',async(req,res)=>{
    if(req.session.admin || req.session.teacher){
        try{
            const students = await StudentModel.find({classid : req.body.classid}).exec();
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
        console.log(teachers);
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