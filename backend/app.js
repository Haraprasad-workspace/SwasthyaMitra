const express = require('express');
const cors = require('cors');
const http = require('http'); // 🔑 Required for WebSockets
const { Server } = require('socket.io'); // 🔑 Required for WebSockets
require('dotenv').config();

const authRoutes = require('./routes/auth_routes');
const staffRoutes = require('./routes/staff_routes');
const queueRoutes = require('./routes/queue_routes');
const clinicroutes = require('./routes/clinic_routes');

const app = express();
const server = http.createServer(app); // 🔑 Create HTTP server

// 🛠️ Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

// Middlewares
app.use(cors());
app.use(express.json());

// 📢 Inject Socket.io into every request
// This allows you to use req.io.to(clinicId).emit() in your controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

io.on('connection', (socket) => {
    console.log('⚡ Client Connected:', socket.id);

    socket.on('joinClinic', (clinicId) => {
        if (!clinicId) {
            console.error(`❌ Socket ${socket.id} tried to join an undefined room!`);
            return;
        }
        socket.join(clinicId.toString());
        console.log(`🏥 Socket ${socket.id} successfully joined Room: ${clinicId}`);
        
        // Let the client know they joined successfully
        socket.emit('joined', { room: clinicId });
    });

    socket.on('disconnect', () => {
        console.log('❌ Client Disconnected:', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/clinic', clinicroutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Swasthya-Mitra Backend with WebSockets is running...');
});

const PORT = process.env.PORT || 5000;

// 🔑 IMPORTANT: Listen using 'server', not 'app'
server.listen(PORT, () => {
    console.log(`🚀 Server & WebSockets running on port ${PORT}`);
});

module.exports = app;