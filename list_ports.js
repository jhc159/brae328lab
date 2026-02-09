#!/usr/bin/env node
/**
 * List Available Serial Ports
 * Helpful for finding the Arduino Uno's USB port
 */

const SerialPort = require('serialport');

async function listPorts() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   Available Serial Ports               ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  try {
    const ports = await SerialPort.SerialPort.list();
    
    if (ports.length === 0) {
      console.log('❌ No serial ports found!\n');
      console.log('Troubleshooting:');
      console.log('  1. Connect your Arduino Uno with USB cable');
      console.log('  2. Check if the Arduino is powered on');
      console.log('  3. Try a different USB cable');
      console.log('  4. Check Device Manager (Windows) or System Report (Mac)\n');
      return;
    }
    
    console.log(`Found ${ports.length} serial port(s):\n`);
    
    ports.forEach((port, index) => {
      console.log(`Port ${index + 1}:`);
      console.log(`  Path:           ${port.path}`);
      console.log(`  Manufacturer:   ${port.manufacturer || '(Unknown)'}`);
      console.log(`  Serial Number:  ${port.serialNumber || '(Unknown)'}`);
      console.log(`  Product ID:     ${port.productId || '(Unknown)'}`);
      console.log(`  Vendor ID:      ${port.vendorId || '(Unknown)'}`);
      
      // Help identify Arduino
      if (port.manufacturer && port.manufacturer.toLowerCase().includes('arduino')) {
        console.log(`  ⭐ This looks like Arduino!\n`);
      } else {
        console.log();
      }
    });
    
    // Show recommended port
    const arduinoPort = ports.find(p => p.manufacturer && p.manufacturer.toLowerCase().includes('arduino'));
    if (arduinoPort) {
      console.log(`\n✓ Recommended port for Arduino Uno: ${arduinoPort.path}`);
      console.log(`\nUsage:`);
      console.log(`  node serial_bridge.js ${arduinoPort.path} 9600\n`);
    } else {
      console.log(`\n⚠️  Could not automatically identify Arduino port`);
      console.log(`\nTry connecting with the first port:`);
      if (ports.length > 0) {
        console.log(`  node serial_bridge.js ${ports[0].path} 9600\n`);
      }
    }
    
  } catch (error) {
    console.error('Error listing ports:', error.message);
    if (error.code === 'EACCES') {
      console.log('\n⚠️  Permission denied. Try running with sudo:');
      console.log('  sudo node list_ports.js\n');
    }
  }
}

listPorts();
