const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cv_project');
        console.log(`MongoDB connecté : ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
