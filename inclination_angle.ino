// ADXL335 Accelerometer Inclination Angle Measurement
// Arduino Nano with ADXL335 Accelerometer

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
const unsigned long OUTPUT_INTERVAL = 100; // milliseconds

void setup() {
  // Initialize Serial Communication at 9600 baud
  Serial.begin(9600);
  delay(500);
  Serial.println("ADXL335 Inclination Angle Measurement");
  Serial.println("========================================");
}

void loop() {
  // Read accelerometer values
  Axraw = analogRead(pinAx);
  Ayraw = analogRead(pinAy);
  Azraw = analogRead(pinAz);
  
  // Convert raw values to voltage (0-5V for 10-bit ADC)
  Axout = (Axraw / 1023.0) * 5.0;
  Ayout = (Ayraw / 1023.0) * 5.0;
  Azout = (Azraw / 1023.0) * 5.0;
  
  // ADXL335 output at 0g is 2.5V, sensitivity is ~330mV/g
  // Convert voltage to acceleration (in g units)
  // Axout = (Axout - 2.5) / 0.33;  // Optional: uncomment for g-based calculation
  // Ayout = (Ayout - 2.5) / 0.33;
  // Azout = (Azout - 2.5) / 0.33;
  
  // Calculate inclination angles using the provided equations
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
  
  // Output angles every 100ms
  if (millis() - lastOutputTime >= OUTPUT_INTERVAL) {
    lastOutputTime = millis();
    
    // Print angles in degrees
    Serial.print("Theta: ");
    Serial.print(theta, 2);
    Serial.print(" deg | Psi: ");
    Serial.print(psi, 2);
    Serial.print(" deg | Phi: ");
    Serial.print(phi, 2);
    Serial.println(" deg");
  }
}
