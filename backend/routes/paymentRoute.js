const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe('YOUR_STRIPE_SECRET_KEY'); // Use environment variables for security

const router = express.Router();

// Endpoint to create a PaymentIntent
router.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in cents
            currency,
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
