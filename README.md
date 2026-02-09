# brae328lab

3. Inclination angle measurement

Angle of inclination means by how much angle the device is tilted from its plane of surface. Angle of inclination are shown in Figure 3.

To calculate angle of inclination of X, Y, Z axis from its reference, we need to use below formulas.

In the C program, please use function atan2() for atan, sqrt() for square root, pow() to find the power of the given number. Hint: Please search these C functions online for detailed information.

We get these angles in radians. So, multiply these values by (180/π) to get angle in degrees within range of -90° to +90° each axis (you can use PI for pi in the program). Program your Arduino and output the angles every 100 ms.


prompt
using arduino nano and ADXL335 accelerometer,
find angle of inclination using equations:

theta = atan(Axout/sqrt(Ayout^2 + Azout^2))

psi = atan(Ayout/sqrt(Axout^2 + Azout^2))

phi = atan(sqrt(Axout^2 + Ayout^2)/Azout)

functions:
atan2() for atan
sqrt() for square root
pow() for power of given number

radians to degrees:
multiply values by (180/PI)

output angles every 100ms