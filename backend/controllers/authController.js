import User from '../models/userModel.js'
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../authMiddleware.js';

export const signup = async(req, res, next) =>{
    const { username, password, email } = req.body;

    if(!username || !password || !email){
        next(errorHandler(400, 'All fields are required'));
    }
    const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                status: "failed",
                data: [],
                message: "It seems you already have an account, please log in instead.",
            });

    const newUser = new User({
        username,
        password,
        email
    });

try{
    await newUser.save();
    res.json('signup successful')
} catch(error){
    next(error);
}
}

export const signin = async(req, res, next) =>{
    const { email, password } = req.body;

    if(!email || !password|| email==='' || password===''){
        next(errorHandler(400, 'All fields are important'));
    }

    try{
        const validUser = await User.findOne({ email }).select("+password");
        if(!validUser){
            next(errorHandler(404, 'User not found'));
        }

        const isMatch = await validUser.comparePassword(password);
        if (!isMatch) {
            return next(errorHandler(400, 'Invalid Password'))
        }

        const token = jwt.sign({
            id: validUser._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
            
            res.status(200).cookie('token', token, {
                httpOnly: true,
                // secure: process.env.NODE_ENV === 'production',
                secure: true,
                sameSite: 'lax',
            }).json('SignIn Successful');
    }
    catch(error){
        next(error);
    }
}

export const signout = async (req, res, next) => {
    try {
      
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/'
      });
  
      
      res.status(200).json({ 
        message: 'Logged out successfully', 
        isAuthenticated: false 
      });
    } catch (error) {
      next(error);
    }
  };

export const checkAuth = async (req, res) => {
    try {
      const token = req.cookies.token;
  
      if (!token) {
        return res.status(200).json({ isAuthenticated: false });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(200).json({ isAuthenticated: false });
      }
  
      res.status(200).json({ isAuthenticated: true });
    } catch (error) {
      res.status(200).json({ isAuthenticated: false });
    }
  };
  