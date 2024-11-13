// server.js
const express = require('express');
const path = require('path');
require('dotenv').config();
const getToken = require('./api/get-token');

const app = express();
const port = 3000;

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname)));

// Token endpoint
app.get('/api/get-token', (req, res, next) => {
  console.log('Token endpoint hit');
  getToken(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Environment variables loaded:', {
    clientId: process.env.SPOTIFY_CLIENT_ID ? 'Set' : 'Missing',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET ? 'Set' : 'Missing'
  });
});