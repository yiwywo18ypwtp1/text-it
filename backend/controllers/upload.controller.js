const { PrismaClient } = require('@prisma/client');
const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');
const { getClerkUserData } = require('../utils/clerk.ts');
const prisma = new PrismaClient();


const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(filePath) {
   const resp = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file: fs.createReadStream(filePath),
   });
   return resp.text;
}

exports.uploadFile = async (req, res) => {
   try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: 'no file uploaded' });

      const clerkId = req.header('x-clerk-user-id');
      if (!clerkId) return res.status(401).json({ error: 'missing Clerk iD' });

      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) return res.status(404).json({ error: 'user not found' });

      const filePath = path.join(__dirname, '..', 'uploads', file.filename);

      const transcript = await transcribeAudio(filePath);

      const upload = await prisma.upload.create({
         data: {
            userId: user.id,
            result: transcript,
            paid: false,
         },
      });

      console.log(`file uploaded: ${file.filename}`);

      res.status(201).json({
         message: 'file uploaded and transcribed',
         transcript,
         upload,
      });
   } catch (err) {
      console.error('upload error:', err);
      res.status(500).json({ error: 'internal server error' });
   }
};

exports.getMyUploads = async (req, res) => {
   try {
      const clerkId = req.headers['x-clerk-user-id'];
      if (!clerkId) return res.status(400).json({ error: 'Missing Clerk User ID' });

      let user = await prisma.user.findUnique({ where: { clerkId } });

      if (!user) {
         const clerkUser = await getClerkUserData(clerkId, clerkApiKey);
         // console.log('clerkUser:', clerkUser);
         user = await prisma.user.create({
            data: {
               clerkId,
               email: clerkUser.email_addresses[0].email_address,
            }
         });
      }

      const uploads = await prisma.upload.findMany({
         where: { userId: user.id },
         orderBy: { createdAt: 'desc' },
      });

      res.json(uploads);
   } catch (error) {
      console.error('Get uploads error:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
};
