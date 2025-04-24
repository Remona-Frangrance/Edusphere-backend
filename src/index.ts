import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import boardRoutes from './routes/boardRoutes';
import standardRoutes from './routes/standardRoutes';
import subjectRoutes from './routes/subjectRoutes';
import resourceRoutes from './routes/resourceRoutes';
import paymentRoutes from './routes/paymentRoutes';
import authRoutes from './routes/authRoutes';
import testRoutes from './routes/testProtected';
import subscriptionRoutes from './routes/subscriptionRoutes';
import stripeRoutes from './routes/stripe';
import bodyParser from 'body-parser';
import adminAuthRoute from './routes/Admin/adminAuth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ Use raw bodyParser only for the webhook route
app.use('/api/stripe/webhook', bodyParser.raw({ type: 'application/json' }));

// ✅ Use JSON for all others AFTER the webhook
app.use(express.json());

// ✅ Now import other routes including stripe (but without double applying raw)
app.use('/api/stripe', stripeRoutes);

app.get('/', (req, res) => {
  res.send('EduSphere API is running...');
});

app.use('/api/boards', boardRoutes);
app.use('/api/standards', standardRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/subscribe', subscriptionRoutes);


app.use('/admin/auth', adminAuthRoute);

// DB connection
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log('DB connection error:', err));
