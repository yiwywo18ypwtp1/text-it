require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
   origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://text-it-hu9a.vercel.app',
      'https://text-it-hu9a.vercel.app/'
   ],
   methods: ['GET', 'POST'],
   allowedHeaders: ['Content-Type', 'x-clerk-user-id'],
}));

const webhookRoutes = require('./routes/webhook.routes');
app.use('/api/webhook', webhookRoutes);

app.use(express.json());

const userRoutes = require('./routes/users.routes');
const uploadRoutes = require('./routes/upload.routes');
const paymentRoutes = require('./routes/payment.routes');

app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

app.listen(PORT, () => {
   console.log(`Server running at http://localhost:${PORT}`);
});
