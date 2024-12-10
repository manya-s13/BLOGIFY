import express from 'express'
import User from '../models/userModel.js'
import Blog from '../models/blogModel.js'
import { getblogs, signups } from '../controllers/analysisController.js';

const analysisRouter = express.Router();

analysisRouter.get('/signups', signups);
analysisRouter.get('/getblogs', getblogs);

export default analysisRouter;