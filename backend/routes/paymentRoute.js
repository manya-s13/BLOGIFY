import express from 'express';
import paymentController from '../controllers/paymentController.js';

const paymentsRouter = express.Router();

 paymentsRouter.post('/create-checkout-session', paymentController);

 export default paymentsRouter;