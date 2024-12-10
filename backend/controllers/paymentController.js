import User from "../models/userModel.js";
import stripe from "stripe";
import jwt  from "jsonwebtoken";

const stripee = new stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = async (req, res) => {
    try{
  const token = req.cookies.token;
  console.log(token)
  if (!token) {
   return res.status(401).json({ message: "not authenticated" });
  } 

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Reached Here")
  console.log(decoded); 

  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401).json({ message: "unauthorized user" });
  }

  const lineItems = [
    
    
];

  const session = await stripee.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
        price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Subscription",
            },
            unit_amount: 10000,
          },
          quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.STRIPE_SUCCESS_URL}`,
    cancel_url: `${process.env.STRIPE_CANCEL_URL}`,
    metadata: {
        userId: decoded.id, // Pass the user ID here
      },
  });

  res.json({ id: session.id });
}catch(error){
  res.status(500).json({message: 'Server error'})
}
};

export default paymentController;
