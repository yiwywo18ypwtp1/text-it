const { PrismaClient } = require('../generated/prisma');
const router = require('express').Router();
const prisma = new PrismaClient();

router.get('/ping-db', async (req, res) => {
   try {
      await prisma.user.findFirst();
      res.status(200).json({ message: 'DB is awake' });
   } catch (err) {
      console.error('Ping DB error:', err);
      res.status(500).json({ error: 'Failed to connect to DB' });
   }
});

module.exports = router;
