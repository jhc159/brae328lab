# Arduino Uno USB Serial Setup Guide

This guide explains how to connect an Arduino Uno to your computer via USB and display angle data on the web application.

## 📋 Requirements

- Arduino Uno board
- ADXL335 accelerometer module
- USB cable (Type-B)
- Computer with Node.js installed
- Arduino IDE (for uploading code)

## 🔌 Hardware Connections

### Wiring Diagram

```
ADXL335 Module     →    Arduino Uno
─────────────────────────────────
GND               →    GND
VCC (5V)          →    5V
X (Ax)            →    A0
Y (Ay)            →    A1
Z (Az)            →    A2
```

### Connection Details

| ADXL335 Pin | Arduino Pin | Description |
|-------------|------------|-------------|
| GND | GND | Ground |
| VCC | 5V | Power (5V) |
| X-OUT (Ax) | A0 | X-axis analog input |
| Y-OUT (Ay) | A1 | Y-axis analog input |
| Z-OUT (Az) | A2 | Z-axis analog input |

**Note**: Make sure to use the correct voltage for your ADXL335 module (some modules require 3.3V instead of 5V).

## 📥 Step 1: Upload Arduino Code

### Option 1: Using Arduino IDE (Recommended)

1. **Connect Arduino to Computer**
   - Use USB Type-B cable to connect Arduino Uno to your computer
   - The board will power on (you'll see an LED light up)

2. **Download Arduino IDE**
   - Visit https://www.arduino.cc/en/software
   - Install for your operating system

3. **Open Arduino IDE**
   - Copy all code from [arduino_uno_serial.ino](arduino_uno_serial.ino)
   - Paste into a new Arduino IDE sketch

4. **Select Board and Port**
   - Go to **Tools → Board** and select **Arduino Uno**
   - Go to **Tools → Port** and select your USB port
     - **Windows**: Usually COM3 or COM4
     - **Mac**: Usually /dev/cu.usbmodem* or /dev/cu.Usbserial-*
     - **Linux**: Usually /dev/ttyACM0 or /dev/ttyUSB0

5. **Verify and Upload**
   - Click the ✓ (Verify) button to check for errors
   - Click the → (Upload) button to upload to Arduino
   - You should see "Done uploading" message

### Option 2: Using Arduino Web Editor

1. Go to https://create.arduino.cc/editor
2. Create a new sketch
3. Paste code from [arduino_uno_serial.ino](arduino_uno_serial.ino)
4. Click Upload button

## 🔍 Step 2: Find Your Serial Port

### Using the List Ports Tool

```bash
node list_ports.js
```

**Example output:**
```
Found 2 serial port(s):

Port 1:
  Path:           /dev/ttyACM0
  Manufacturer:   Arduino (www.arduino.cc)
  Serial Number:  59AB123456789
  ⭐ This looks like Arduino!

Recommended port for Arduino Uno: /dev/ttyACM0
```

### If Not identified Automatically

#### Windows
1. Right-click **This PC** → **Manage**
2. Click **Device Manager**
3. Look under **Ports (COM & LPT)**
4. Find "Arduino Uno" or similar device
5. Note the port number (e.g., COM3)

#### macOS
```bash
# List all USB devices
ls /dev/tty.usb* 
ls /dev/cu.usb*

# Look for entries like: /dev/cu.usbmodem14201
```

#### Linux
```bash
# List all tty devices
ls /dev/tty* | grep -E "ttyACM|ttyUSB"

# Or use dmesg to see Arduino connection
dmesg | tail -20
```

## 🚀 Step 3: Start the Application

### 3A: Start the Web Server (Terminal 1)

```bash
cd /workspaces/brae328lab
npm install          # Only needed on first setup
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  Inclination Angle Monitor Server      ║
╚════════════════════════════════════════╝

🌐 Server running at http://localhost:3000
```

### 3B: Start the Serial Bridge (Terminal 2)

```bash
# Use the port found in Step 2
node serial_bridge.js /dev/ttyACM0 9600
```

**For Windows:**
```bash
node serial_bridge.js COM3 9600
```

You should see:
```
📡 Attempting to connect to /dev/ttyACM0 @ 9600 baud...
✓ Serial port opened successfully
Waiting for data from Arduino...
```

## 🌐 Step 4: View the Data

1. Open your web browser
2. Navigate to: **http://localhost:3000**
3. You should see the Live angle data updating in real-time!

### What You'll See

- **Theta (θ)**: X-axis inclination angle
- **Psi (ψ)**: Y-axis inclination angle
- **Phi (φ)**: Z-axis inclination angle
- **Raw ADC Values**: 0-1023 readings from each axis
- **Voltage Readings**: Converted from raw values
- **Data History**: Last 20 readings with timestamps

Tilt the ADXL335 module and watch the angles change on the screen!

## 🧪 Testing

### Manual Test Data

If you don't have the ADXL335 module yet, you can test the system:

```bash
# Generate test data patterns
python3 test_data.py circular 10      # Simulate circular motion
python3 test_data.py random 10        # Simulate random motion
```

### Check Server Health

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{"status":"ok","clients":1}
```

## 🚨 Troubleshooting

### "Error: Port not found"

**Problem**: Serial port not recognized
```
error: Port '/dev/ttyACM0' not found
```

**Solutions**:
1. Check physical USB connection
2. Try different USB port or cable
3. List available ports:
   ```bash
   node list_ports.js
   ```
4. On Linux, you may need to add user to dialout group:
   ```bash
   sudo usermod -a -G dialout $USER
   ```
5. On Windows, check Device Manager for unknown devices

### "Port already in use" Error

```
Error: EADDRINUSE: address already in use :::3000
```

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or use a different port - edit server.js:
# const port = 3001;
```

### No Data Appearing

**Check 1**: Is Arduino uploading successfully?
- Look for "Done uploading" message in Arduino IDE
- Check for any syntax errors in the sketch

**Check 2**: Is the serial bridge connected?
```bash
# Look for "Serial port opened successfully" message
node serial_bridge.js /dev/ttyACM0 9600
```

**Check 3**: Is the web server running?
```bash
# Try accessing the health endpoint
curl http://localhost:3000/health
```

**Check 4**: Are connections correct?
- Verify ADXL335 wiring matches the diagram
- Check power supply (5V for standard ADXL335)
- Try different Arduino analog pins

### Connection Drops

If the serial connection drops, the bridge will exit. Restart it:
```bash
node serial_bridge.js /dev/ttyACM0 9600
```

To keep it running continuously, use a process manager:
```bash
# Using pm2 (install: npm install -g pm2)
pm2 start serial_bridge.js --name "arduino-bridge"
pm2 logs arduino-bridge
```

## 📊 Data Format

### Serial Output from Arduino

The Arduino sends data as comma-separated values (CSV):

```
theta,psi,phi,axraw,ayraw,azraw,axvolt,ayvolt,azvolt
15.23,-22.45,45.67,550,480,600,2.687,2.344,2.930
```

### Web API Format

The serial bridge converts this to JSON and sends to the server:

```json
{
  "theta": 15.23,
  "psi": -22.45,
  "phi": 45.67,
  "axraw": 550,
  "ayraw": 480,
  "azraw": 600
}
```

## 🔧 Advanced Configuration

### Change Baud Rate

If using a different baud rate, modify both:

#### Arduino Code (arduino_uno_serial.ino)
```cpp
Serial.begin(115200);  // Change from 9600
```

#### Serial Bridge Command
```bash
node serial_bridge.js /dev/ttyACM0 115200
```

### Change Data Update Rate

Edit [arduino_uno_serial.ino](arduino_uno_serial.ino):
```cpp
const unsigned long OUTPUT_INTERVAL = 100;  // milliseconds (50-1000 typical)
```

Lower values = faster updates but more data
Higher values = slower updates but less bandwidth

### Store Data to File

Edit [serial_bridge.js](serial_bridge.js) to add:
```javascript
const fs = require('fs');
const logFile = fs.createWriteStream('angle_data.csv', {flags: 'a'});
// Log each reading to CSV file
```

## 📚 Additional Resources

- [Arduino Uno Documentation](https://docs.arduino.cc/hardware/uno-rev3)
- [ADXL335 Datasheet](https://www.analog.com/en/products/adxl335.html)
- [Node.js SerialPort](https://serialport.io/)
- [Express.js Documentation](https://expressjs.com/)

## ✅ Checklist

- [ ] Arduino Uno board purchased and available
- [ ] ADXL335 accelerometer module purchased
- [ ] USB Type-B cable available
- [ ] Arduino IDE installed
- [ ] Node.js and npm installed
- [ ] ADXL335 wired correctly to Arduino pins A0, A1, A2
- [ ] Arduino code uploaded successfully
- [ ] Serial port identified with list_ports.js
- [ ] Web server started (npm start)
- [ ] Serial bridge started (node serial_bridge.js)
- [ ] Web application opens at http://localhost:3000
- [ ] Angle data updating in real-time

## 📝 Notes

- **Upload Once**: You only need to upload the Arduino code once when first setting up
- **Persistent Data**: The serial bridge will continue running and sending data as long as it's connected
- **Multiple Clients**: Multiple web browsers can view the same data simultaneously
- **Data History**: The web app keeps a history of the last 20 readings
- **Power Consumption**: Arduino draws power from the USB connection, no external power needed

## 🆘 Still Having Issues?

1. Check that **all three** terminals are running:
   - Terminal 1: Web server (npm start)
   - Terminal 2: Serial bridge (node serial_bridge.js)
   - Terminal 3: Browser at http://localhost:3000

2. Verify USB cable is working (not just a charging cable)

3. Try resetting the Arduino:
   - Press the RESET button on the Arduino board
   - Wait for 2 seconds
   - Restart the serial bridge

4. Check Arduino IDE serial monitor to verify data is being sent:
   - In Arduino IDE: Tools → Serial Monitor
   - Set baud rate to 9600
   - You should see CSV data appearing

---

**Version**: 1.0.0  
**Last Updated**: February 2026
