import express from 'express'
import User from '../models/userModel.js'
import Blog from '../models/blogModel.js'
import { blogsbyuser, getblogs, published, signups } from '../controllers/analysisController.js';

const analysisRouter = express.Router();

analysisRouter.get('/signups', signups);
analysisRouter.get('/getblogs', getblogs);
analysisRouter.get('/blogsbyuser', blogsbyuser);
analysisRouter.get('/published', published);

export default analysisRouter;