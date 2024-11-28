import express from 'express';
import { blogs, getBlog, myBlogs } from '../controllers/blogController.js';
import { create } from '../controllers/blogController.js'
import { isAuthenticated } from '../authMiddleware.js';

const blogRouter = express.Router();

blogRouter.post('/create', isAuthenticated, create);
blogRouter.get('/blogs', blogs);
blogRouter.get('/myBlogs', isAuthenticated, myBlogs);
blogRouter.get('/:id', getBlog);

export default blogRouter;