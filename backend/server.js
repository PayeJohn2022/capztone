const express = require('express');
const cors = require('cors');
const http = require('http');
const authRoutes = require('./routes/authRoutes');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: 'https://kiddiecare.netlify.app' } });
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use((req, res, next) => {
  req.io = io; // Attach the `io` instance
  next();
});
app.use(express.json({
  origin: 'https://kiddiecare.netlify.app', // Allow only the frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})); // Use built-in JSON body parser from Express
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io setup
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("DoctorCall", (data) => {
    io.emit('ReceiveCall', data);
  });
});

// API Routes
app.use('/api', authRoutes);

// Serve static files from React app
const frontendPath = path.join(__dirname, '../client/build'); // Adjust if needed
app.use(express.static(frontendPath));

// Fallback for React Router
app.get('*', (req, res) => {
  if (!req.originalUrl.startsWith('/api')) {
    res.sendFile(path.join(frontendPath, 'index.html'));
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction ? 'Server encountered an error' : err.message;
  const status = err.status || 500;

  res.status(status).json({ message, error: isProduction ? null : err.stack });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log registered routes
console.log("Registered routes:");
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(middleware.route.path);
  }
});
