# 📐 BRAE328 Lab - Inclination Angle Monitor

## Question 4: Application Development

This project develops a complete web application to display, visualize, and monitor raw angle data from an ADXL335 accelerometer sensor.

### 4.1 ✅ Develop an application to show the raw angle data on a webpage

**Status**: COMPLETED

A full-featured web application has been created that displays:
- Real-time angle data (Theta, Psi, Phi) in degrees
- Raw ADC values (0-1023)
- Converted voltage readings (0-5V)
- Data history with timestamps
- Live updates every 500ms

**Files**: 
- [index.html](index.html) - Main web application (responsive design)
- [server.js](server.js) - Node.js backend with Express and WebSocket

### 4.2 Plot the angles on the webpage

**Status**: COMPLETED ✅

The application now includes a real-time interactive angle plot featuring:
- Interactive line chart showing all three angles (Theta, Psi, Phi)
- Color-coded lines: Blue (Theta), Pink (Psi), Cyan (Phi)
- Last 50 data points displayed for trend visualization
- Hover tooltips showing exact values
- Smooth animations and responsive design
- Y-axis range: -90° to +90°
- Time-based X-axis labels

**Features**:
- Real-time updates as data arrives
- Legend with angle labels
- Grid lines for easy reading
- Responsive canvas that adapts to screen size
- Performance optimized with `update('none')` for smooth rendering

### 4.3 Display and visualize the gesture of a 3D object

**Status**: READY FOR EXTENSION

The angle data (Theta, Psi, Phi) is available for 3D visualization using:
- Three.js
- Babylon.js
- Canvas 3D

---

## 🚀 Quick Start

### Installation & Setup

```bash
# Install dependencies
npm install

# Start the server
npm start

# Open in browser
# http://localhost:3000
```

### Arduino Uno via USB Connection

**Step 1: Upload Arduino Code**
1. Connect your Arduino Uno to your computer via USB
2. Open Arduino IDE
3. Copy code from [arduino_uno_serial.ino](arduino_uno_serial.ino)
4. Paste into Arduino IDE
5. Select Board: "Arduino Uno"
6. Select Port: Your USB port
7. Click Upload

**Step 2: Find the Serial Port**
```bash
# List all available serial ports
node list_ports.js
```

**Step 3: Start the Serial Bridge**
```bash
# Linux/macOS example
node serial_bridge.js /dev/ttyACM0 9600

# Windows example
node serial_bridge.js COM3 9600
```

**Step 4: View Data**
- Open http://localhost:3000 in your browser
- Data from Arduino will appear in real-time

### Testing Without Hardware

```bash
# Using Python test script
python3 test_data.py health          # Check server health
python3 test_data.py single          # Send single data point
python3 test_data.py circular 10     # Simulate circular motion for 10 seconds
python3 test_data.py random 10       # Simulate random motion for 10 seconds
```

---

## 📁 Project Structure

```
brae328lab/
├── index.html                    # Web application (frontend)
├── server.js                     # Express server with WebSocket
├── serial_bridge.js              # Serial port reader/forwarder
├── list_ports.js                 # USB serial port lister utility
├── package.json                  # Node.js dependencies
├── arduino_uno_serial.ino        # Arduino Uno sketch for Uno via USB
├── arduino_wifi_example.ino      # Arduino WiFi example code (WiFi boards)
├── test_data.py                  # Python test utility
├── ARDUINO_SETUP.md              # Arduino Uno USB setup guide
├── USAGE.md                       # Detailed documentation
├── inclination_angle             # Original Arduino code reference
├── README.md                     # This file
└── .gitignore                    # Git ignore rules
```

---

## 🎯 Features

### Web Application
✅ Display Theta, Psi, Phi angles in real-time  
✅ Show raw ADC values and voltage readings  
✅ **Interactive real-time angle plot (Chart.js)** ⭐  
✅ Maintain 20-entry data history  
✅ Manual angle input for testing  
✅ Random data generator for demos  
✅ Responsive design (desktop/mobile)  
✅ Color-coded display cards  
✅ Real-time updates via WebSocket or polling  
✅ Connection status indicator

### Backend Server
✅ Express.js HTTP server  
✅ WebSocket support for real-time data  
✅ REST API endpoint (`POST /api/angles`)  
✅ Health check endpoint (`GET /health`)  
✅ Multi-client support  
✅ Efficient data broadcasting  

### Data Integration
✅ REST API for HTTP requests  
✅ WebSocket for real-time updates  
✅ Python test utility  
✅ Arduino WiFi example code  
✅ Browser-based data entry  

---

## 📊 Data Specifications

### Angle Values
- **Range**: -180° to 180°
- **Unit**: Degrees
- **Precision**: 0.01°
- **Update Rate**: Configurable (default: 500ms)

### Raw ADC Values
- **Range**: 0-1023 (10-bit ADC)
- **Voltage Range**: 0-5V
- **Conversion**: `V = (Raw / 1023.0) * 5.0`

### Angle Calculations
From ADXL335 accelerometer readings:
```
θ (Theta) = atan2(Ax, √(Ay² + Az²))
ψ (Psi)   = atan2(Ay, √(Ax² + Az²))
φ (Phi)   = atan2(√(Ax² + Ay²), Az)
```

---

## 🔌 Integration Examples

### Using REST API (curl)
```bash
curl -X POST http://localhost:3000/api/angles \
  -H "Content-Type: application/json" \
  -d '{"theta": 15.5, "psi": -22.3, "phi": 45.0}'
```

### Using Python
```python
import requests

data = {
  "theta": 15.5,
  "psi": -22.3,
  "phi": 45.0,
  "axraw": 550,
  "ayraw": 480,
  "azraw": 600
}

response = requests.post('http://localhost:3000/api/angles', json=data)
print(response.json())
```

### Using Arduino (WiFi)
See [arduino_wifi_example.ino](arduino_wifi_example.ino) for complete example

### Using JavaScript
```javascript
const data = {
  theta: 15.5,
  psi: -22.3,
  phi: 45.0
};

fetch('http://localhost:3000/api/angles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
}).then(res => res.json());
```

---

## 📋 Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- **Browser**: Modern browser with WebSocket support (Chrome, Firefox, Safari, Edge)
- **Python**: v3.6+ (for test utility, optional)

### Additional Hardware (Optional)
- Arduino board with WiFi capability (MKR WiFi 1010, etc.)
- ADXL335 accelerometer module
- 3.3V power supply

---

## 🛠 Configuration

### Server Port
Edit `server.js`:
```javascript
const port = 3000;
```

### Update Frequency
Edit `index.html`:
```javascript
setInterval(simulateSerialData, 500);  // milliseconds
```

### History Size
Edit `index.html`:
```javascript
const MAX_HISTORY = 20;
```

---

## 📖 Documentation

- **[ARDUINO_SETUP.md](ARDUINO_SETUP.md)** - Complete Arduino Uno USB setup guide ⭐ START HERE
- [USAGE.md](USAGE.md) - Comprehensive usage guide with all details
- [index.html](index.html) - Frontend source code with inline comments
- [server.js](server.js) - Backend source code with comments
- [serial_bridge.js](serial_bridge.js) - Serial port bridge for Arduino Uno
- [test_data.py](test_data.py) - Python test utility with examples
- [arduino_uno_serial.ino](arduino_uno_serial.ino) - Arduino Uno sketch
- [arduino_wifi_example.ino](arduino_wifi_example.ino) - Arduino WiFi integration guide

---

## 🧪 Testing

### Test Server Health
```bash
curl http://localhost:3000/health
```

### Test Single Data Point
```bash
curl -X POST http://localhost:3000/api/angles \
  -H "Content-Type: application/json" \
  -d '{"theta": 45, "psi": -30, "phi": 60}'
```

### Generate Test Sequences
```bash
# Circular motion simulation
python3 test_data.py circular --duration 30 --interval 0.1

# Random motion
python3 test_data.py random --duration 30
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Port 3000 already in use" | Change port in server.js or kill old process: `lsof -i :3000` |
| "Cannot connect from Arduino" | Ensure same network, check firewall, use server IP not localhost |
| "Data not updating" | Check browser console (F12), verify server running: `curl localhost:3000/health` |
| "WebSocket connection fails" | Firewall may block port 3000, try REST API instead |

---

## 🔮 Future Enhancements

- [ ] 3D visualization of object gesture using Three.js
- [ ] Historical data graphing (Chart.js, Plotly)
- [ ] Data export to CSV/JSON
- [ ] Real-time signal processing
- [ ] Sensor calibration interface
- [ ] Multiple sensor support
- [ ] Data recording and replay
- [ ] Alert/threshold system

---

## 📝 License

MIT License - Free to use and modify

---

## 📚 References

- **Arduino Reference**: [inclination_angle](inclination_angle) - Original Arduino sketch
- **ADXL335 Datasheet**: 3-axis accelerometer specifications
- **Express.js**: https://expressjs.com/
- **WebSocket**: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Status**: Development Complete (4.1)

