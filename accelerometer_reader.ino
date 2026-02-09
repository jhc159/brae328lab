// ADXL335 Accelerometer Reading for Arduino Uno
// Reads acceleration data every 1ms and converts to g-force

// Analog pins for ADXL335
const int X_PIN = A0;
const int Y_PIN = A1;
const int Z_PIN = A2;

// Constants for conversion
const float REF_VOLTAGE = 5.0;
const float ADC_MAX = 1023.0;
const float OFFSET = 1.65;
const float SENSITIVITY = 0.33;

// Timing variable
unsigned long lastReadTime = 0;
const unsigned long READ_INTERVAL = 1; // 1 millisecond

void setup() {
  // Initialize serial communication at 9600 baud
  Serial.begin(9600);
  
  // Configure analog pins as inputs
  pinMode(X_PIN, INPUT);
  pinMode(Y_PIN, INPUT);
  pinMode(Z_PIN, INPUT);
  
  Serial.println("ADXL335 Accelerometer Reader Initialized");
  Serial.println("Time(ms)\tAx(g)\tAy(g)\tAz(g)");
}

void loop() {
  // Check if it's time to take a reading (every 1ms)
  if (millis() - lastReadTime >= READ_INTERVAL) {
    lastReadTime = millis();
    
    // Read analog values from accelerometer
    int rawX = analogRead(X_PIN);
    int rawY = analogRead(Y_PIN);
    int rawZ = analogRead(Z_PIN);
    
    // Convert ADC values to g-force using the provided formula
    // Axout = (((X axis ADC value *5.0) / 1023.0) – 1.65) / 0.33
    float Axout = (((rawX * REF_VOLTAGE) / ADC_MAX) - OFFSET) / SENSITIVITY;
    float Ayout = (((rawY * REF_VOLTAGE) / ADC_MAX) - OFFSET) / SENSITIVITY;
    float Azout = (((rawZ * REF_VOLTAGE) / ADC_MAX) - OFFSET) / SENSITIVITY;
    
    // Send data to serial port
    Serial.print(millis());
    Serial.print("\t");
    Serial.print(Axout, 3); // Print with 3 decimal places
    Serial.print("\t");
    Serial.print(Ayout, 3);
    Serial.print("\t");
    Serial.println(Azout, 3);
  }
}
