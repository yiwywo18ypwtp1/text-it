const { PrismaClient } = require('@prisma/client');
const router = require('express').Router();
const prisma = new PrismaClient();

router.get('/ping-db', async (req, res) => {
   try {
      console.log('DB_URL:', process.env.DATABASE_URL);
      await prisma.user.findFirst();
      res.send('DB is awake!');
   } catch (e) {
      console.error('Ping DB error:', e);
      res.status(500).json({ error: 'Failed to connect to DB' });
   }
});


module.exports = router;
