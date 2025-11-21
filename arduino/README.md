This is the code to upload to your **Arduino Nano 33 IoT device**.

Once uploaded, it will connect to your wifi and listen on the port 80 for requests to controls LED strips connected to its circuit.

You will need to install the following drivers & libraries:

**Drivers**

- Arduino SAMD Boards

**Libraries**
- FastLED
- WiFiWebServer

You will need to fill in the following two constants to allow the card to connect to your wifi:

- ssid
- password

**API**

***GET - leds***
`/leds?leds=[leds]&color=[R, V, B]&noreset=[0|1]`
> `Example: /leds?leds=1,30,500&color=50,25,200`

*Required:*
 1. `leds` - LEDs number to switch on, separated by comma. 
 2. `color` - LEDs color. 3 RVB decimal values, separated by comma.

 *Optional:*
 1. `noreset` - `1` to **not** turn-off LEDs before applying the new rule.

***GET - tracker***
`tracker?disable=[0|1]`
>`Example: /tracker`

*Required:*
1. `disable` -  Disable animation triggered by motion sensor.

***GET - ruler***
`ruler?reset=[0|1]`
>`Example: /ruler`

*Optional:*
1. `reset` -  Turn off LEDs.
