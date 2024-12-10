import User from '../models/userModel.js'
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../authMiddleware.js';
import fs from 'fs';
import path from 'path'
import { sendEMail } from '../sendMail.js'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

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
    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        email: newUser.email,
      },
    });
} catch(error){
    next(error);
}
}

// export const signin = async(req, res, next) =>{
//     const { email, password } = req.body;

//     if(!email || !password|| email==='' || password===''){
//         next(errorHandler(400, 'All fields are important'));
//     }

//     try{
//         const validUser = await User.findOne({ email }).select("+password");
//         if(!validUser){
//             next(errorHandler(404, 'User not found'));
//         }

//         const isMatch = await validUser.comparePassword(password);
//         if (!isMatch) {
//             return next(errorHandler(400, 'Invalid Password'))
//         }

//         const loginOtp = Math.floor(100000 + Math.random() * 900000);
//         const loginOtpExpire = new Date(Date.now() + process.env.LOGIN_OTP_EXPIRE * 60 * 1000);

//         let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');

       
//         const subject = "Verify your account";
       

//         emailTemplate = emailTemplate.replace('{{OTP_CODE}}', loginOtp);
//         emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
//         emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
//         emailTemplate = emailTemplate.replace('{{USER_ID}}', validUser._id.toString());

//         await sendEMail({
//             email, 
//             subject, 
//             html: emailTemplate,
//         })

//         validUser.loginOtp = loginOtp;
//         validUser.loginOtpExpire = loginOtpExpire;
//         validUser.loginAttempts = 0;
//         validUser.lockUntil = undefined

//         await validUser.save();

//         const token = jwt.sign({
//             id: validUser._id}, process.env.JWT_SECRET, { expiresIn: '1h'});
            
//             res.status(200).cookie('token', token, {
//                 httpOnly: true,
//                 secure: true,
//                 sameSite: 'lax',
//             }).json({
//               message: 'signin successful',
//               user: {
//                 _id: validUser._id, 
//             },
//             });
//     }
//     catch(error){
//         next(error);
//     }
// }

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password || email === '' || password === '') {
      return next(errorHandler(400, 'All fields are important'));
  }

  try {
      const validUser = await User.findOne({ email }).select('+password');
      if (!validUser) {
          return next(errorHandler(404, 'User not found'));
      }

      // Check if the account is locked
      if (validUser.lockUntil && validUser.lockUntil > Date.now()) {
          return next(errorHandler(400, 'Account is locked. Please try again later.'));
      }

      // Compare passwords
      const isMatch = await validUser.comparePassword(password);
      if (!isMatch) {
          // Increment login attempts if password is incorrect
          validUser.loginAttempts += 1;

          // Lock the account if max attempts exceeded
          if (validUser.loginAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
              validUser.lockUntil = Date.now() + process.env.OTP_LOCK_TIME * 60 * 1000; // Lock account for OTP_LOCK_TIME minutes
          }

          await validUser.save();
          return next(errorHandler(400, 'Invalid Password'));
      }

      // Reset failed login attempts on successful login
      validUser.loginAttempts = 0;
      validUser.lockUntil = undefined;

      // Generate OTP for login
      const loginOtp = Math.floor(100000 + Math.random() * 900000);
      const loginOtpExpire = new Date(Date.now() + process.env.LOGIN_OTP_EXPIRE * 60 * 1000); 
      
      console.log("Generated OTP:", loginOtp);
      console.log("OTP Expiry:", loginOtpExpire);

      let emailTemplate = fs.readFileSync(path.join(__dirname, '../templates/mail.html'), 'utf-8');
      const subject = "Verify your account";

      emailTemplate = emailTemplate.replace('{{OTP_CODE}}', loginOtp);
      emailTemplate = emailTemplate.replaceAll('{{MAIL}}', process.env.SMTP_USER);
      emailTemplate = emailTemplate.replace('{{PORT}}', process.env.PORT);
      emailTemplate = emailTemplate.replace('{{USER_ID}}', validUser._id.toString());

      // Send OTP email
      await sendEMail({
          email,
          subject,
          html: emailTemplate,
      });

      // Save OTP and expiration time
      validUser.loginOtp = loginOtp;
      validUser.loginOtpExpire = loginOtpExpire;
      await validUser.save();

      // Generate JWT token for session
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Send response with cookie containing JWT
      res.status(200).cookie('token', token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
      }).json({
          message: 'Signin successful. Please verify your OTP.',
          user: {
              _id: validUser._id,
          },
      });
  } catch (error) {
      next(error);
  }
};

// export const verifyLoginOtp = async(req, res) =>{
//   const { otp } = req.body;
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.loginOtp !== otp || new Date() > user.loginOtpExpire) {
//       return res.status(400).json({ message: "Invalid or expired OTP" });
//     }

//     // Clear OTP fields on success (optional)
//     user.loginOtp = null;
//     user.loginOtpExpire = null;
//     await user.save();

//     res.status(200).json({ message: "OTP verified successfully" });
//   } catch (error) {
//     console.error("Error in OTP verification:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

export const verifyLoginOtp = async (req, res) => {
  const { otp } = req.body;
  const { id } = req.params;

  try {
    // Fetch user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is locked due to failed attempts
    if (user.loginOtpAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
      if (user.loginOtpAttemptsExpire > Date.now()) {
        return res.status(400).json({ message: "Too many OTP attempts. Please try again later." });
      } else {
        // Reset login attempts after lockout period expires
        user.loginOtpAttempts = 0;
        user.loginOtpAttemptsExpire = undefined;
      }
    }

    // Check OTP validity
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Check if OTP has expired
    if (new Date() > user.loginOtpExpire) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if the OTP entered matches the stored one
    if (Number(user.loginOtp )!== Number(otp)) {
      // Increment OTP attempts
      user.loginOtpAttempts += 1;

      // Set the expiration time for the login attempts
      if (user.loginOtpAttempts >= process.env.MAX_LOGIN_ATTEMPTS) {
        user.loginOtpAttemptsExpire = new Date(Date.now() + process.env.OTP_LOCK_TIME * 60 * 1000); // Lock for OTP_LOCK_TIME minutes
      }

      await user.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP fields on success (optional)
    user.loginOtp = null;
    user.loginOtpExpire = null;
    user.loginOtpAttempts = 0;  // Reset OTP attempts on success
    user.loginOtpAttemptsExpire = null;  // Reset lock expiration
    await user.save();

    // Generate a token and send it in response (using your logic)
    const token = await user.generateToken(); // Assuming `generateToken` method exists

    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'none',
      secure: true
    }

    res.status(200).cookie('token', token, options).json({
      success: true,
      message: "OTP verified successfully",
      data: user,
    });

  } catch (error) {
    console.error("Error in OTP verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

export const getSubscriptionStatus = async (req,res) => {
  try {
    
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(200).json({ isAuthenticated: false });
    }
    const subscriptionStatus = user.subscribed;
    console.log(subscriptionStatus)
    res.status(200).json({ isSubscribed: subscriptionStatus });
  } catch (error) { 
   console.log(error)
  }
}
  