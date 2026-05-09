require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./lib/db');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://workflowx-teal.vercel.app',
      'https://workflowx.vercel.app',
      'http://localhost:5173'
    ];
    
    // Check if origin is in allowedOrigins or matches vercel preview deployment patterns
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app') || origin.includes('workflowx-') && origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
