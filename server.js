// Simple Express server to serve the angle monitoring application
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('Client connected. Total clients:', clients.size + 1);
    clients.add(ws);

    // Send initial data
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to angle data server'
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received data:', data);

            // Broadcast to all connected clients
            broadcast({
                type: 'angle_update',
                timestamp: new Date().toISOString(),
                data: data
            });
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    });

    // Handle client disconnect
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected. Total clients:', clients.size);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Broadcast function to send data to all connected clients
function broadcast(data) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// REST API endpoint to receive angle data
app.post('/api/angles', (req, res) => {
    const { theta, psi, phi, axraw, ayraw, azraw } = req.body;

    if (theta !== undefined || psi !== undefined || phi !== undefined) {
        // Broadcast to WebSocket clients with connection indicator
        broadcast({
            type: 'angle_update',
            timestamp: new Date().toISOString(),
            connected: true,  // Mark as connected
            data: {
                theta: theta || 0,
                psi: psi || 0,
                phi: phi || 0,
                axraw: axraw || 0,
                ayraw: ayraw || 0,
                azraw: azraw || 0
            }
        });

        res.json({ status: 'success', message: 'Data received' });
    } else {
        res.status(400).json({ status: 'error', message: 'Missing angle data' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', clients: clients.size });
});

// Start server
server.listen(port, () => {
    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  Inclination Angle Monitor Server      ║`);
    console.log(`╚════════════════════════════════════════╝\n`);
    console.log(`🌐 Server running at http://localhost:${port}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${port}`);
    console.log(`🔌 REST API: POST /api/angles`);
    console.log(`❤️  Health check: GET /health\n`);
});
