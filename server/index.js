import express from 'express'
import session from 'express-session'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express()
dotenv.config(
    { path: './.env', }
)



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})