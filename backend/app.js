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
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const isProduction = process.env.NODE_ENV === 'production';
let server = null;
let io = null;

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true
};

// 🛠️ Initialize Socket.io
if (!isVercel) {
    server = http.createServer(app); // 🔑 Create HTTP server
    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            methods: ["GET", "POST", "PATCH", "DELETE"]
        }
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
}

// Middlewares
app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));

// 📢 Inject Socket.io into every request
// This allows you to use req.io.to(clinicId).emit() in your controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/clinic', clinicroutes);

// Health Check
app.get('/', (req, res) => {
    res.send('Swasthya-Mitra Backend is running...');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        environment: process.env.NODE_ENV || 'development',
        serverless: isVercel,
        socketEnabled: !isVercel,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

if (!isVercel) {
    // 🔑 IMPORTANT: Listen using 'server', not 'app'
    server.listen(PORT, () => {
        if (!isProduction) {
            console.log(`🚀 Server & WebSockets running on port ${PORT}`);
        }
    });
}

module.exports = app;