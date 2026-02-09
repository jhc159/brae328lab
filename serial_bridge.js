#!/usr/bin/env node
/**
 * Arduino Serial Bridge
 * 
 * Reads angle data from Arduino Uno connected via USB serial
 * and sends it to the web server
 * 
 * Usage:
 *   node serial_bridge.js [port] [baudrate]
 * 
 * Examples:
 *   node serial_bridge.js /dev/ttyACM0 9600        # Linux
 *   node serial_bridge.js COM3 9600                # Windows
 *   node serial_bridge.js /dev/tty.usbmodem11 9600 # macOS
 */

const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const fetch = require('node-fetch');
const path = require('path');

// Configuration
const DEFAULT_PORT = process.argv[2] || '/dev/ttyACM0';
const DEFAULT_BAUD = parseInt(process.argv[3]) || 9600;
const SERVER_URL = 'http://localhost:3000/api/angles';

// State tracking
let isConnected = false;
let lastDataTime = 0;
let dataCount = 0;
let errorCount = 0;

console.log('\n╔════════════════════════════════════════╗');
console.log('║  Arduino Serial Bridge for Web App     ║');
console.log('╚════════════════════════════════════════╝\n');

/**
 * Parse CSV data from Arduino
 * Format: theta,psi,phi,axraw,ayraw,azraw,axvolt,ayvolt,azvolt
 */
function parseArduinoData(line) {
  try {
    const parts = line.split(',');
    
    if (parts.length !== 9) {
      return null;
    }
    
    return {
      theta: parseFloat(parts[0]),
      psi: parseFloat(parts[1]),
      phi: parseFloat(parts[2]),
      axraw: parseInt(parts[3]),
      ayraw: parseInt(parts[4]),
      azraw: parseInt(parts[5]),
      axvolt: parseFloat(parts[6]),
      ayvolt: parseFloat(parts[7]),
      azvolt: parseFloat(parts[8])
    };
  } catch (e) {
    return null;
  }
}

/**
 * Send data to web server
 */
async function sendToServer(data) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        theta: data.theta,
        psi: data.psi,
        phi: data.phi,
        axraw: data.axraw,
        ayraw: data.ayraw,
        azraw: data.azraw
      })
    });
    
    if (!response.ok) {
      console.error(`✗ Server error: ${response.status}`);
      errorCount++;
      return false;
    }
    
    return true;
  } catch (error) {
    if (errorCount % 10 === 0) {  // Print every 10th error to avoid spam
      console.error(`✗ Could not reach server: ${error.message}`);
    }
    errorCount++;
    return false;
  }
}

/**
 * Print status info
 */
function printStatus(data) {
  const now = Date.now();
  
  // Print status every second
  if (now - lastDataTime >= 1000) {
    lastDataTime = now;
    
    const status = isConnected ? '🟢 CONNECTED' : '🔴 DISCONNECTED';
    console.log(`[${new Date().toLocaleTimeString()}] ${status} | θ=${data.theta.toFixed(2)}° ψ=${data.psi.toFixed(2)}° φ=${data.phi.toFixed(2)}° | Packets: ${dataCount}`);
  }
}

/**
 * Connect to serial port
 */
function connectSerial() {
  console.log(`📡 Attempting to connect to ${DEFAULT_PORT} @ ${DEFAULT_BAUD} baud...`);
  
  const serialPort = new SerialPort(DEFAULT_PORT, {
    baudRate: DEFAULT_BAUD,
    autoOpen: true
  });
  
  const parser = serialPort.pipe(new Readline({ delimiter: '\n' }));
  
  // Connection opened
  serialPort.on('open', () => {
    isConnected = true;
    console.log(`✓ Serial port opened successfully\n`);
    console.log('Waiting for data from Arduino...\n');
  });
  
  // Data received
  parser.on('data', async (line) => {
    line = line.trim();
    
    // Skip empty lines and header messages
    if (!line || line.startsWith('START') || line.includes('Theta,Psi')) {
      return;
    }
    
    // Parse the CSV data
    const data = parseArduinoData(line);
    
    if (data && !isNaN(data.theta)) {
      // Send to server
      const success = await sendToServer(data);
      
      if (success) {
        dataCount++;
        printStatus(data);
      }
    }
  });
  
  // Error handling
  serialPort.on('error', (error) => {
    console.error(`\n✗ Serial Port Error: ${error.message}`);
    console.error(`\nTroubleshooting:`);
    console.error(`1. Check that Arduino Uno is connected to USB`);
    console.error(`2. Verify the port name: ${DEFAULT_PORT}`);
    console.error(`3. Make sure no other application is using this port`);
    console.error(`4. Try listing available ports: node list_ports.js\n`);
    process.exit(1);
  });
  
  // Port closed
  serialPort.on('close', () => {
    console.log('\n⚠️  Serial port closed');
    process.exit(0);
  });
}

/**
 * List available serial ports
 */
async function listPorts() {
  try {
    const ports = await SerialPort.SerialPort.list();
    
    if (ports.length === 0) {
      console.log('No serial ports found!');
      return;
    }
    
    console.log('Available Serial Ports:\n');
    ports.forEach((port, index) => {
      console.log(`${index + 1}. ${port.path}`);
      console.log(`   Manufacturer: ${port.manufacturer || 'Unknown'}`);
      console.log(`   Serial Number: ${port.serialNumber || 'Unknown'}`);
      console.log();
    });
  } catch (error) {
    console.error('Error listing ports:', error.message);
  }
}

/**
 * Main
 */
async function main() {
  // Check if listing ports was requested
  if (process.argv[2] === '--list' || process.argv[2] === '-l') {
    await listPorts();
    process.exit(0);
  }
  
  console.log(`Configuration:`);
  console.log(`  Port: ${DEFAULT_PORT}`);
  console.log(`  Baud Rate: ${DEFAULT_BAUD}`);
  console.log(`  Server: ${SERVER_URL}\n`);
  
  // Check if server is reachable
  console.log('✓ Checking server connectivity...');
  try {
    const response = await fetch('http://localhost:3000/health');
    if (response.ok) {
      console.log('✓ Server is reachable\n');
    } else {
      console.log('⚠️  Server returned status:', response.status);
      console.log('⚠️  Make sure the web server is running: npm start\n');
    }
  } catch (error) {
    console.log('✗ Server not reachable:', error.message);
    console.log('⚠️  Make sure the web server is running: npm start\n');
  }
  
  // Connect to Arduino
  connectSerial();
}

// Signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Shutting down gracefully...');
  console.log(`\nStatistics:`);
  console.log(`  Total Packets Received: ${dataCount}`);
  console.log(`  Errors: ${errorCount}`);
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nTerminated');
  process.exit(0);
});

// Run
main();
