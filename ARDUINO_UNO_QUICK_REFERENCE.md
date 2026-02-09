# Arduino Uno Quick Reference

## Hardware Setup (2 minutes)

```
ADXL335 Module    Arduino Uno
──────────────────────────────
GND         ──→  GND
VCC (5V)    ──→  5V
X           ──→  A0
Y           ──→  A1
Z           ──→  A2
```

## Software Setup (5 minutes)

### 1. Upload Arduino Code
```bash
# Copy arduino_uno_serial.ino to Arduino IDE and upload
# Board: Arduino Uno
# Port: Your USB port
```

### 2. Find Serial Port
```bash
node list_ports.js
# Look for "Arduino" in the manufacturer column
```

### 3. Terminal 1: Start Web Server
```bash
npm install    # First time only
npm start
# Opens at http://localhost:3000
```

### 4. Terminal 2: Start Serial Bridge
```bash
# Replace /dev/ttyACM0 with your port from step 2
node serial_bridge.js /dev/ttyACM0 9600

# Windows example:
# node serial_bridge.js COM3 9600
```

### 5. View Data
```
Open browser: http://localhost:3000
Tilt the ADXL335 and watch angles change!
```

## Data Format

Arduino sends CSV data:
```
theta,psi,phi,axraw,ayraw,azraw,axvolt,ayvolt,azvolt
15.23,-22.45,45.67,550,480,600,2.687,2.344,2.930
```

Web server displays in real-time with:
- Angle values (degrees)
- Raw ADC values (0-1023)
- Voltage readings (0-5V)
- 20-entry history

## Common Issues

| Issue | Fix |
|-------|-----|
| Port not found | Verify USB cable and connection, check Device Manager |
| No data appearing | Check Arduino sketch uploaded, verify serial bridge says "opened successfully" |
| "Port already in use" | Kill other process: `lsof -i :3000` or use different port |
| Connection drops | Restart serial bridge with same command |

## File Reference

| File | Purpose |
|------|---------|
| `arduino_uno_serial.ino` | Upload this to Arduino |
| `serial_bridge.js` | Reads serial data and sends to web |
| `list_ports.js` | Find your USB port |
| `ARDUINO_SETUP.md` | Detailed setup guide |

## Baud Rate

- **Default**: 9600 (most compatible)
- **Change in Arduino code**: `Serial.begin(9600);`
- **Change in command**: `node serial_bridge.js /dev/ttyACM0 115200`

## Testing

```bash
# No Arduino? Use test data:
python3 test_data.py circular 10    # Simulate motion
python3 test_data.py random 10      # Simulate noise
```

---

**Ready to go!** 🚀 Start with ARDUINO_SETUP.md for detailed instructions.
