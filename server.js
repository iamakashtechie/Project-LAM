const express = require('express');
const path = require('path');
require('dotenv').config();
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));

app.get('/api/token', async (req, res) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return res.status(500).json({ error: 'Missing Spotify credentials' });
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error('Failed to get token');
        }

        const data = await response.json();
        res.json({ token: data.access_token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});