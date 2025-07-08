const express = require('express');
const router = express.Router();
const stripe = require('../stripe');
const {PrismaClient} = require('../generated/prisma');
const prisma = new PrismaClient();


exports.createCheckoutSession = async (req, res) => {
   try {
      const {clerkId} = req.body;
      if (!clerkId) return res.status(400).json({error: 'Missing clerkId'});

      const user = await prisma.user.findUnique({where: {clerkId}});
      if (!user) return res.status(404).json({error: 'User not found'});

      const session = await stripe.checkout.sessions.create({
         payment_method_types: ['card'],
         mode: 'payment',
         line_items: [
            {
               price_data: {
                  currency: 'usd',
                  product_data: {
                     name: 'Extra Voice to Text Uploads',
                  },
                  unit_amount: 777, // ну шоб точно гарненько))
               },
               quantity: 1,
            },
         ],
         success_url: `http://localhost:3000/payment-success`,
         cancel_url: `http://localhost:3000/`,
         metadata: {
            userId: user.id.toString(),
         },
      });

      res.json({url: session.url});
   } catch (error) {
      console.error('Stripe session error:', error);
      res.status(500).json({error: 'Internal server error'});
   }
}
