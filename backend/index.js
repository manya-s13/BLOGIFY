import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import blogRoute from './routes/blogRoute.js'
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose.connect(process.env.MONGO)
.then(()=> {
    console.log("mongoDb is connected")
}).catch(err =>{
    console.log(err)
})


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true, 
}));
app.use(cookieParser());

app.listen(4001, ()=>{
    console.log("server is running on port 4001")
})

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/blog', blogRoute);


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})