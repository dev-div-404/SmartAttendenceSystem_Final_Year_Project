import express from 'express';
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './DB/connDB.js'
import ClassModel from './DB/ClassSchema.js'
import StudentModel from './DB/StudentSchema.js';



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


app.post('/getstudents',async(req,res)=>{
    if(req.session.admin){
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

app.get('/getadmin',(req,res)=>{
    if(req.session.admin){
        res.status(200).json({ loggedin : true, admin : req.session.admin })
    }else{
        res.status(200).json({ loggedin : false })
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

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})