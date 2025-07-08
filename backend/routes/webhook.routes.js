const express = require('express');
const router = express.Router();
const stripe = require('../stripe');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
   const sig = req.headers['stripe-signature'];

   let event;
   try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
   } catch (err) {
      console.log(`webhook signature verification failed.`, err.message);
      return res.status(400).send(`webhook Error: ${err.message}`);
   }

   if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      const userId = parseInt(session.metadata.userId);
      const amount = session.amount_total;

      try {
         await prisma.payment.create({
            data: {
               userId,
               amount,
               stripeSessionId: session.id,
            },
         });

         await prisma.user.update({
            where: { id: userId },
            data: { isPro: true },
         });

         console.log(`payment successful. User ${userId} upgraded to Pro.`);
      } catch (error) {
         console.error('error handling payment webhook:', error);
         return res.status(500).json({ error: 'Internal error' });
      }
   }

   res.json({ received: true });
});

module.exports = router;
