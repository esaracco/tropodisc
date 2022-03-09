This is the code to upload to your **Arduino Nano 33 IoT device**.

Once uploaded, it will connect to your wifi and listen on the port 80 for request to controls LED strips connected to its circuit.

You will need to install the following drivers & libraries:

**Drivers**

- Arduino SAMD Boards

**Libraries**
- Functional-Vlpp
- WiFiNINA_Generic
- WiFiWebServer
- Adafruit NeoPixel
- StringSplitter

You will need to fill in the following two constants to allow the card to connect to your wifi:

- ssid
- password
