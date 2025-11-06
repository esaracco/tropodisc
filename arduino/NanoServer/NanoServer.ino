#include <WiFiWebServer.h>
#include <FastLED.h>

#undef DEBUG

#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
#define LED_PIN1 2    // D2 strip 1
#define LED_PIN2 3    // D3 strip 2
#define MOTION_PIN 9  // D9 motion sensor (interrupt)
#define NUM_LEDS 200  // Leds per strip
#define NUM_STRIPS 2  // Number of strips
#define TIMEOUT 5     // in minute

CRGB leds[NUM_STRIPS][NUM_LEDS];

const char *ssid = "********";      // wifi SSID
const char *password = "********";  // wifi password

uint32_t startTime = 0;               // for timeout management
volatile byte motionState = LOW;      // for motion sensor
bool disableMotionDetection = false;  // disable/enable permanently motion detection
bool blockMotionAction = false;       // block/unblock temporarily motion detection

WiFiWebServer server(80);

/**
* Setup
*/
void setup() {
#ifdef DEBUG
  Serial.begin(9600);
  while (!Serial) {
    delay(250);
  }
#endif

  initWiFi();
  initStrips();
  initMotion();

  server.on("/leds", HTTP_GET, onServerEventLeds);
  server.on("/ruler", HTTP_GET, onServerEventRuler);
  server.on("/motion", HTTP_GET, onServerEventMotion);
  server.begin();
}

/**
* Main loop
*/
void loop() {
  server.handleClient();
  handleTimeout();
  handleMotion();
}

///////////////////////////////// SETUP INIT /////////////////////////////////

/**
* Wifi initialization
*/
void initWiFi() {
  while (WiFi.begin(ssid, password) != WL_CONNECTED) {
    delay(250);
  }

#ifdef DEBUG
  Serial.print("WiFi OK on ");
  Serial.println(WiFi.localIP());
#endif
}

/**
* Strips initialization
*/
void initStrips() {
  FastLED.addLeds<LED_TYPE, LED_PIN1, COLOR_ORDER>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, LED_PIN2, COLOR_ORDER>(leds[1], NUM_LEDS);
  FastLED.setBrightness(10);

  runAnimation();
}

/**
* Motion sensor initialization
*/
void initMotion() {
  pinMode(MOTION_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(MOTION_PIN), onInterruptEventMotion, RISING);
}

///////////////////////////////// INTERRUPTS EVENTS /////////////////////////////////

/*
* Interrupt event triggered by motion sensor
*/
void onInterruptEventMotion() {
  motionState = HIGH;
}

///////////////////////////////// LOOP CHECKS /////////////////////////////////

/**
* Turn off all leds after TIMEOUT seconds
*/
void handleTimeout() {
  if (startTime && (millis() - startTime >= TIMEOUT * 60 * 1000)) {
    startTime = 0;
    FastLED.clear(true);
    blockMotionAction = false;
  }
}

/*
* Run animation if motion has been detected
*/
void handleMotion() {
  if (motionState == HIGH) {
#ifdef DEBUG
    Serial.println("HIGH");
#endif
    motionState = LOW;
    if (!disableMotionDetection && !blockMotionAction) {
      runAnimation();
    }
  }
}

///////////////////////////////// WEB SERVER EVENTS /////////////////////////////////

/**
* Server Event to turn on leds.
*
* @param leds string Leds numbers separated by comma if more than one (from 1 to NUM_LEDS)
* @param color string RGB colors separated by comma
* @param noreset int 1/0 Do not reset strip before setting leds / or reset
*/
void onServerEventLeds() {
  const byte noReset = server.arg("noreset") ? server.arg("noreset") == "1" : 0;
  int *ledsValues = getValues(server.arg("leds"));
  int *colorValues = getValues(server.arg("color"));
  byte R, G, B;

  if (!ledsValues || server.arg("color").equals("0,0,0")) {
    free(colorValues);
    free(ledsValues);

    startTime = 0;
    FastLED.clear(true);
    blockMotionAction = false;
  } else {
    blockMotionAction = true;
#ifdef DEBUG
    String remoteIP = server.client().remoteIP().toString();
    String response = server.arg("leds") + "|" + server.arg("color");

    response += " " + remoteIP;
    Serial.println(response);
#endif
    if (!colorValues) {
      R = 25;
      G = 25;
      B = 25;
    } else {
      R = *colorValues;
      G = *(colorValues + 1);
      B = *(colorValues + 2);
    }

    if (!noReset) {
      startTime = 0;
      FastLED.clear();
    }

    int *ptr = ledsValues;
    while (*ptr > 0) {
      const int position = *ptr - 1;
      const byte strip = abs((float)position / NUM_LEDS);

      leds[strip][position - (NUM_LEDS * strip)].setRGB(R, G, B);
      ++ptr;
    }

    free(colorValues);
    free(ledsValues);

    FastLED.show();
    startTime = millis();
  }
  server.send(200);
}

/**
* Server Event to show/hide ruler.
*
* @param reset int 1/0 to show/hide
*/
void onServerEventRuler() {
  byte reset = server.arg("reset") ? server.arg("reset") == "1" : 0;
  startTime = 0;

  if (reset) {
    FastLED.clear(true);
    blockMotionAction = false;
  } else {
    blockMotionAction = true;
    FastLED.clear();

    for (byte strip = 0; strip < NUM_STRIPS; strip++) {
      for (byte i = 0; i < NUM_LEDS; i++) {
        if (!i) continue;
        if (i % 10 == 0) {
          leds[strip][i - 1] = CRGB::Blue;
        } else if (i % 5 == 0) {
          leds[strip][i - 1] = CRGB::White;
        }
      }
    }

    startTime = millis();
    FastLED.show();
  }
  server.send(200);
}

/**
* Server event to disable/enable motion detection.
*
* @param disable int 1/0 to disable/enable
*/
void onServerEventMotion() {
  disableMotionDetection = (bool)server.arg("disable").equals("1");
  server.send(200);
}

///////////////////////////////// UTILS /////////////////////////////////

/**
* Little leds animation
*/
void runAnimation() {
  FastLED.setBrightness(255);
  for (int i = 0; i < 2; i++) {
    for (int strip = 0; strip < NUM_STRIPS; strip++) {
      const int stripIndex = i ? (NUM_STRIPS - 1) - strip : strip;
      for (int led = 0; led < NUM_LEDS; led++) {
        if (led % 5 == 0) {
          FastLED.clear();
          leds[stripIndex][i ? (NUM_LEDS - 1) - led : led] = CRGB::DarkOrange;
          FastLED.show();
        }
      }
    }
  }
  FastLED.setBrightness(10);
  FastLED.clear(true);
}

/**
* Explode a comma separated string in int array.
*
* @param _buf String Args passed to server
* @return int* New allocated array of integers
*/
int *getValues(String _buf) {
  if (!_buf || !_buf.length()) return NULL;
  int *ret = NULL;
  char buf[_buf.length() + 2] = { 0 };
  _buf.toCharArray(buf, _buf.length() + 1);
  char *token = strtok(buf, ",");

  if (token != NULL) {
    ret = (int *)malloc(sizeof(int));
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
