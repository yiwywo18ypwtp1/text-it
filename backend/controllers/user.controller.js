const { PrismaClient } = require('@prisma/client');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const prisma = new PrismaClient();


exports.signUp = async (req, res) => {
   try {
      // console.log('SIGNUP BODY:', req.body);

      const clerkId = req.body.data?.id;
      const email = req.body.data?.email_addresses?.[0]?.email_address;

      if (!clerkId || !email) {
         return res.status(400).json({ error: 'missing clerkId or email' });
      }

      const existingUser = await prisma.user.findUnique({ where: { clerkId } });
      if (existingUser) return res.status(200).json(existingUser);

      const user = await prisma.user.create({
         data: { clerkId, email },
      });

      res.status(201).json(user);
   } catch (error) {
      console.error('signup error:', error);
      res.status(500).json({ error: 'internal server error' });
   }
};

exports.getCurrentUser = async (req, res) => {
   try {
      const clerkId = req.headers['x-clerk-user-id'];
      if (!clerkId) return res.status(401).json({ error: 'unauthorized' });

      const user = await prisma.user.findUnique({
         where: { clerkId },
         include: { uploads: true },
      });

      if (!user) return res.status(404).json({ error: 'user not found' });

      res.json({ isPro: user.isPro, uploads: user.uploads });
   } catch (error) {
      console.error('error getting user:', error);
      res.status(500).json({ error: 'internal server error' });
   }
};