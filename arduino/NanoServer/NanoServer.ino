/*
  Copyright (C) 2022 Emmanuel Saracco
  This file is part of TropoDisc <https://github.com/esaracco/tropodisc>.

  TropoDisc is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  TropoDisc is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with TropoDisc.  If not, see <http://www.gnu.org/licenses/>.
*/

#include <Wire.h>
#include <WiFiWebServer.h>
#include <Adafruit_NeoPixel.h>

#undef WITH_SERIAL

// PINs on the Arduino Nano 33 IoT
const byte ADA_PIN1 = 9; // D9 1st floor (led strip 1)
const byte ADA_PIN2 = 8; // D8 2nd floor (led strip 2)
const byte ADA_PIN3 = 7; // D7 3rd floor (led strip 3) 
const int ADA_NUMPIXELS = 99; // Leds by strip
Adafruit_NeoPixel strips[] = {
  Adafruit_NeoPixel(ADA_NUMPIXELS, ADA_PIN1, NEO_GRB + NEO_KHZ800),
  Adafruit_NeoPixel(ADA_NUMPIXELS, ADA_PIN2, NEO_GRB + NEO_KHZ800),
  Adafruit_NeoPixel(ADA_NUMPIXELS, ADA_PIN3, NEO_GRB + NEO_KHZ800)
};
const int ADA_NUMSTRIPS = sizeof(strips) / sizeof(*strips);

const char *ssid = "********";
const char *password = "********";

WiFiWebServer server(80);

//////////////////////////////////////////////////////////////////////////////

// SETUP
void setup () {
  #ifdef WITH_SERIAL
    Serial.begin (9600);
    delay (1000);
  #endif

  initStrips();
  clearStrips();

  connectWiFi();

  showStrips();

  server.on("/setLeds", HTTP_GET, handleSetLeds);
  server.on("/regle", HTTP_GET, handleRegle);
  server.begin();
}

// MAIN LOOP
void loop () {
  server.handleClient();
}

//////////////////////////////////////////////////////////////////////////////

// FUNCTION connectWiFi()
void connectWiFi () {
  for (byte i = 0; i < 3; i++) {
    if (WiFi.begin(ssid, password) == WL_CONNECTED) {
      #ifdef WITH_SERIAL
        Serial.print("WiFi OK: ");
        Serial.println(WiFi.localIP());
      #endif
      return;
    }
    delay(250);
  }

  #ifdef WITH_SERIAL
    Serial.println("WiFi KO!");
  #endif
  strips[0].setPixelColor(0, strips[0].Color(1, 0, 0));
}

// FUNCTION handleRegle()
void handleRegle () {
  clearStrips();

   if (!server.arg("reset") || server.arg("reset") != "1") {
     for (byte etage = 0; etage < ADA_NUMSTRIPS; etage++) {
       for (byte i = 1; i < ADA_NUMPIXELS; i++) {
         if (i % 10 == 0) {
           strips[etage].setPixelColor(i - 1, strips[etage].Color(0, 0, 1));
         } else if (i % 5 == 0) {
           strips[etage].setPixelColor(i - 1, strips[etage].Color(1, 1, 1));
         }
       }
    }
  }

  showStrips();

  server.send(200);
}

// FUNCTION handleSetLeds()
void handleSetLeds () {
  // ARG leds=posled1,posled2,posled3...
  // Example: leds=234,240
  int *ledsValues = getValues(server.arg("leds"));
  // ARG color=numR,numG,numB.
  // Example: color=15,50,45
  int *colorValues = getValues(server.arg("color"));

  if (!server.arg("noreset") || server.arg("noreset") != "1") {
    clearStrips();
  }

  if (ledsValues && colorValues) {
    const byte R = colorValues[0];
    const byte G = colorValues[1];
    const byte B = colorValues[2];

    for (int *ptr = ledsValues; *ptr >= 0; ptr++) {
      int position = *ptr - 1;
      int row = abs((float) position / ADA_NUMPIXELS);
      int col = position - (ADA_NUMPIXELS * row);

      strips[row].setPixelColor(col, strips[row].Color(R, G, B));
    }
  }

  showStrips();

  if (ledsValues) {
    free(ledsValues);
  }
  if (colorValues) {
    free(colorValues);
  }

  server.send(200);
}

// FUNCTION initStrips()
void initStrips () {
  for (byte i = 0; i < ADA_NUMSTRIPS; i++) {
    strips[i].begin();
  }
}

// FUNCTION clearStrips()
void clearStrips () {
  for (byte i = 0; i < ADA_NUMSTRIPS; i++) {
    strips[i].clear();
  }
}

// FUNCTION showStrips()
void showStrips () {
  for (byte i = 0; i < ADA_NUMSTRIPS; i++) {
    strips[i].show();
  }
}

// FUNCTION getValues()
int * getValues (String _buf) {
  if (!_buf || !_buf.length()) {
    return NULL;
  }
    
  char buf[_buf.length() + 2] = {0};
  int *ret = NULL;
  
  _buf.toCharArray(buf, _buf.length() + 1);

  char *token = strtok(buf, ",");

  if (token != NULL) {
    ret = (int *)malloc (sizeof(int));
    
    byte i = 0;
    while (token != NULL) {
      ret[i++] = atoi(token);
      ret = (int *)realloc(ret, sizeof(int) * (i + 1));
      token = strtok(NULL, ",");
    }
    memset(&ret[i], -1, sizeof(int));
  }

  return ret;
}
