const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import connection
require('./Db/Connections');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' })); // allow React frontend
app.use(express.json());

// Import routes
const pasteRoutes = require('./Routes/PasteRoutes');
app.use('/api', pasteRoutes);

// Health check
app.get('/api/healthz', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1;

  res.json({
    ok: dbStatus,
    database: dbStatus ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
