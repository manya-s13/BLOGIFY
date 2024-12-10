import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import { isAuthenticated } from "../authMiddleware.js";

export const create = async(req, res, next) =>{
    try{
        const { title, content } = req.body;
        if(!title || !content){
            res.status(404).json({message: 'All fields are required'});
        }

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
          }

        const newBlog = new Blog({
            title,
            content,
            author: req.user._id
        })
        await newBlog.save();

        const user = await User.findById(req.user._id)
        if (user) {
            user.blogs.push(newBlog._id);
            await user.save();
          }

        res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
    
    }catch(error){
        next(error)
    }
}

export const blogs = async(req, res )=>{
    try {
        const blogs = await Blog.find().populate('author', 'username email');
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

export const myBlogs = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('blogs');

        if(!user){
            return res.status(404).json({message: 'User not Found'})
        }
        
        res.status(200).json({
            success: true,
            data: user.blogs
        })

        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const getBlog = async(req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author');
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
          }
          res.json(blog);
    } catch (error) {
        res.status(500).json({message: 'Server error'})
    }
}

