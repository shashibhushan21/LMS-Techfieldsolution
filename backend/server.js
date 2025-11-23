const app = require('./app');
const http = require('http');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time features
const io = socketIO(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user-specific room
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join conversation room
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User joined conversation ${conversationId}`);
  });

  // Handle new message with proper persistence
  socket.on('send_message', (data) => {
    // Broadcast the message to all users in the conversation room
    // The message data should already be populated from the API response
    io.to(`conversation_${data.conversationId}`).emit('new_message', {
      _id: data._id,
      conversation: data.conversation || data.conversationId,
      conversationId: data.conversationId,
      sender: data.sender,
      content: data.content,
      attachments: data.attachments || [],
      readBy: data.readBy || [],
      isEdited: data.isEdited || false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    });
  });

  // Handle message read status update
  socket.on('mark_read', (data) => {
    // data contains: conversationId, messageId, userId, readAt
    io.to(`conversation_${data.conversationId}`).emit('message_read', {
      conversationId: data.conversationId,
      messageId: data.messageId,
      userId: data.userId,
      readAt: data.readAt || new Date().toISOString()
    });
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('user_typing', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

// Start server
server.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║   LMS Backend Server                   ║
    ║   Running on port ${PORT}                 ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}             ║
    ╚════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});
