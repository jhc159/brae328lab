# brae328lab

1. Vibration measurement
Program your Arduino to get acceleration data and send the data to your computer’s serial port every 1 ms. Verify your sensor data by slowly rotating your sensor.

prompt
using arduino nano and ADXL335 accelerometer:

read every 1m/s to computer serial port

convert output to g using:

Axout = (((X axis ADC value *5.0) / 1023.0) – 1.65) / 0.33

Ayout = (((Y axis ADC value *5.0) / 1023.0) – 1.65) / 0.33

Azout = (((Z axis ADC value*5.0) / 1023.0) – 1.65) / 0.33
