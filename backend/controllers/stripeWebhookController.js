
const stripeWebhookController = async (req, res) => {
    const endpointSecret = 'whsec_4bd7bba25eeaaf04aef34956d655a3b4e75e4424dfdbb9fc3004a9cd7fdde42e';
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    console.log("in wenbhook")
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const userId = session.metadata.userId;
      console.log(userId + "this the user id ");

      
    } 

    res.status(200).send('Received webhook');
  };

  export default stripeWebhookController;