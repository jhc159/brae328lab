// ADXL335 Accelerometer Inclination Angle Measurement - Arduino Uno
// USB Serial Output for Web Application
//
// Hardware Setup:
// - Arduino Uno
// - ADXL335 Accelerometer module
// - USB cable (Type-B) to connect to computer
// - Connections:
//   * ADXL335 GND -> Arduino GND
//   * ADXL335 VCC -> Arduino 5V
//   * ADXL335 X (Ax) -> Arduino A0
//   * ADXL335 Y (Ay) -> Arduino A1
//   * ADXL335 Z (Az) -> Arduino A2

// ADXL335 Pins (Analog Inputs)
const int pinAx = A0;  // X-axis
const int pinAy = A1;  // Y-axis
const int pinAz = A2;  // Z-axis

// Conversion constant
const float PI = 3.14159265359;

// Variables for accelerometer readings
int Axraw, Ayraw, Azraw;
float Axout, Ayout, Azout;

// Variables for angles
float theta, psi, phi;

// Timing variables
unsigned long lastOutputTime = 0;
const unsigned long OUTPUT_INTERVAL = 100; // Send data every 100ms

void setup() {
  // Initialize Serial Communication at 9600 baud (standard USB rate)
  Serial.begin(9600);
  delay(500);
  
  // Send startup message
  Serial.println("START_ADXL335");
  Serial.println("Theta,Psi,Phi,Ax_raw,Ay_raw,Az_raw,Ax_volt,Ay_volt,Az_volt");
  delay(100);
}

void loop() {
  // Read accelerometer raw values (0-1023)
  Axraw = analogRead(pinAx);
  Ayraw = analogRead(pinAy);
  Azraw = analogRead(pinAz);
  
  // Convert raw values to voltage (0-5V for 10-bit ADC)
  Axout = (Axraw / 1023.0) * 5.0;
  Ayout = (Ayraw / 1023.0) * 5.0;
  Azout = (Azraw / 1023.0) * 5.0;
  
  // Calculate inclination angles using atan2
  // theta = atan(Axout/sqrt(Ayout^2 + Azout^2))
  theta = atan2(Axout, sqrt(pow(Ayout, 2) + pow(Azout, 2)));
  
  // psi = atan(Ayout/sqrt(Axout^2 + Azout^2))
  psi = atan2(Ayout, sqrt(pow(Axout, 2) + pow(Azout, 2)));
  
  // phi = atan(sqrt(Axout^2 + Ayout^2)/Azout)
  phi = atan2(sqrt(pow(Axout, 2) + pow(Ayout, 2)), Azout);
  
  // Convert from radians to degrees
  theta = theta * (180.0 / PI);
  psi = psi * (180.0 / PI);
  phi = phi * (180.0 / PI);
  
  // Send data as CSV every OUTPUT_INTERVAL ms
  if (millis() - lastOutputTime >= OUTPUT_INTERVAL) {
    lastOutputTime = millis();
    
    // Format: theta,psi,phi,axraw,ayraw,azraw,axvolt,ayvolt,azvolt
    Serial.print(theta, 2);
    Serial.print(",");
    Serial.print(psi, 2);
    Serial.print(",");
    Serial.print(phi, 2);
    Serial.print(",");
    Serial.print(Axraw);
    Serial.print(",");
    Serial.print(Ayraw);
    Serial.print(",");
    Serial.print(Azraw);
    Serial.print(",");
    Serial.print(Axout, 3);
    Serial.print(",");
    Serial.print(Ayout, 3);
    Serial.print(",");
    Serial.println(Azout, 3);
  }
}
