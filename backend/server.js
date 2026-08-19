const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Attach Socket instance to Request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
// Import Route Handlers
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/attendance', attendanceRoutes);
// Add these with your other route mounts in server.js
app.use('/api/leave', require('./routes/leaveRoutes'));
app.use('/api/complaint', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));

// Base Route
app.get('/', (req, res) => {
  res.send('HostelEase API Engine Running...');
});

// Socket Listener
io.on('connection', (socket) => {
  console.log(`Websocket Connected: ${socket.id}`);
  
  socket.on('join_block', (hostelBlock) => {
    socket.join(`block_${hostelBlock}`);
  });

  socket.on('disconnect', () => {
    console.log(`Websocket Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));