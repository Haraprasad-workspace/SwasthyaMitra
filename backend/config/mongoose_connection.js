require('dotenv').config();
const mongoose = require('mongoose');

if (!process.env.MONGO_URL) {
    throw new Error('Missing MONGO_URL environment variable');
}

mongoose.connect(process.env.MONGO_URL, {
    serverSelectionTimeoutMS: 10000
})
    .then(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.log('mongodb connected');
        }
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
    });


module.exports = mongoose