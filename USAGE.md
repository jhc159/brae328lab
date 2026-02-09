# 📐 Inclination Angle Monitor - Web Application

A real-time web application for displaying raw angle data from an ADXL335 accelerometer. This application visualizes the three inclination angles (Theta, Psi, Phi) calculated from accelerometer readings.

## Features

✅ **Real-time Angle Display** - Shows Theta, Psi, and Phi angles in real-time  
✅ **Raw Data Visualization** - Displays raw ADC values and voltage readings  
✅ **Data History** - Maintains a history of recent readings  
✅ **Manual Input** - Manually enter angle values for testing  
✅ **Random Data Generator** - Generate realistic test data  
✅ **Responsive Design** - Works on desktop, tablet, and mobile devices  
✅ **WebSocket Support** - Real-time bidirectional communication  
✅ **REST API** - HTTP endpoint for receiving data  

## Project Structure

```
brae328lab/
├── index.html          # Main web application (frontend)
├── server.js           # Express server with WebSocket support
├── package.json        # Node.js dependencies
├── inclination_angle   # Original Arduino code reference
└── README.md           # This file
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open in browser:**
   Navigate to `http://localhost:3000`

## Usage

### Web Interface Features

#### Angle Display Cards
- **Theta (θ)**: X-axis inclination angle (degrees)
- **Psi (ψ)**: Y-axis inclination angle (degrees)  
- **Phi (φ)**: Z-axis inclination angle (degrees)

#### Raw Data Table
Shows:
- Raw ADC values (0-1023)
- Converted voltage values (0-5V)
- Real-time sensor status

#### Manual Input
1. Enter angle values in the input fields
2. Click "Update Display" or press Enter
3. Values are reflected in the display and history

#### Auto-Generation
- Click "Random Data" to generate random realistic values
- Click "Reset" to return to zero values

#### Data History
- Shows the last 20 readings with timestamps
- Displays each update chronologically

### Connecting Arduino Data

#### Option 1: Using REST API

Send HTTP POST request from Arduino or another device:

```bash
curl -X POST http://localhost:3000/api/angles \
  -H "Content-Type: application/json" \
  -d '{"theta": 15.5, "psi": -22.3, "phi": 45.0, "axraw": 550, "ayraw": 480, "azraw": 600}'
```

**Node.js/JavaScript Example:**
```javascript
const data = {
  theta: 15.5,
  psi: -22.3,
  phi: 45.0,
  axraw: 550,
  ayraw: 480,
  azraw: 600
};

fetch('http://localhost:3000/api/angles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

#### Option 2: Using WebSocket

**JavaScript Client Example:**
```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  const data = {
    theta: 15.5,
    psi: -22.3,
    phi: 45.0,
    axraw: 550,
    ayraw: 480,
    azraw: 600
  };
  ws.send(JSON.stringify(data));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```

#### Option 3: Arduino with HTTP Request

For Arduino with WiFi (e.g., Arduino MKR WiFi 1010):

```cpp
#include <WiFi.h>
#include <ArduinoHttpClient.h>

// WiFi credentials
const char ssid[] = "your_ssid";
const char password[] = "your_password";
const char serverAddress[] = "192.168.1.x";  // Server IP
int port = 3000;

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void sendData(float theta, float psi, float phi, int axraw, int ayraw, int azraw) {
  String postData = "{\"theta\":" + String(theta, 2) + 
                    ",\"psi\":" + String(psi, 2) + 
                    ",\"phi\":" + String(phi, 2) +
                    ",\"axraw\":" + String(axraw) +
                    ",\"ayraw\":" + String(ayraw) +
                    ",\"azraw\":" + String(azraw) + "}";
  
  client.post("/api/angles", "application/json", postData);
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();
  
  Serial.println("Status: " + String(statusCode));
  Serial.println("Response: " + response);
}
```

## Data Format

### Angle Values
- **Range**: -180° to 180°
- **Unit**: Degrees  
- **Precision**: Displayed to 2 decimal places

### Raw ADC Values
- **Range**: 0-1023 (10-bit ADC)
- **Mapping**: 0-5V for standard Arduino boards

### Voltage Conversion
```
Voltage (V) = (Raw_Value / 1023.0) * 5.0
```

## API Reference

### REST Endpoints

#### POST /api/angles
Send angle data to the server
- **Body**: JSON object with angle values
- **Response**: `{"status": "success", "message": "Data received"}`

```json
{
  "theta": 15.5,
  "psi": -22.3,
  "phi": 45.0,
  "axraw": 550,
  "ayraw": 480,
  "azraw": 600
}
```

#### GET /health
Check server status
- **Response**: `{"status": "ok", "clients": 2}`

#### GET /
Serve the main web application

### WebSocket Endpoints

Connect to `ws://localhost:3000` to receive real-time updates

**Message Format:**
```json
{
  "type": "angle_update",
  "timestamp": "2026-02-09T10:30:45.123Z",
  "data": {
    "theta": 15.5,
    "psi": -22.3,
    "phi": 45.0
  }
}
```

## Configuration

### Server Port
Edit `server.js` to change the default port:
```javascript
const port = 3000;  // Change this value
```

### History Size
Edit `index.html` to adjust the number of kept history entries:
```javascript
const MAX_HISTORY = 20;  // Change this value
```

### Update Frequency
Modify the simulation interval in `index.html`:
```javascript
setInterval(simulateSerialData, 500);  // milliseconds
```

## Performance

- Supports multiple simultaneous WebSocket connections
- Efficient data broadcasting to all connected clients
- Optimized DOM updates for smooth rendering
- History limited to prevent memory issues

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is already in use
lsof -i :3000

# Use a different port by editing server.js
```

### Can't connect from Arduino
- Verify Arduino and server are on the same network
- Check firewall settings
- Use the server's IP address instead of localhost
- Ensure port 3000 is accessible

### Data not updating
- Check browser console for JavaScript errors (F12)
- Verify server is running (`http://localhost:3000/health`)
- Check network tab for WebSocket/API requests

## Development

### Modify the Frontend
Edit `index.html` to change:
- Layout and styling
- Display options
- Data visualization
- Color scheme

### Extend the Backend
Edit `server.js` to:
- Add data persistence (database)
- Implement data logging
- Add authentication
- Process incoming data

### Example: Add Data Logging

```javascript
const fs = require('fs');

app.post('/api/angles', (req, res) => {
  const { theta, psi, phi } = req.body;
  
  // Log to file
  const logEntry = `${new Date().toISOString()},${theta},${psi},${phi}\n`;
  fs.appendFileSync('angle_data.csv', logEntry);
  
  // ... rest of code
});
```

## License

MIT License - Feel free to use and modify

## Support

For issues, improvements, or questions, refer to the Arduino reference in `inclination_angle` file or modify the application as needed.

---

**Version**: 1.0.0  
**Last Updated**: February 2026
