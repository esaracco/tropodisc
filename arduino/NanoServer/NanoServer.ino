#include <WiFiWebServer.h>
#include <FastLED.h>

#undef DEBUG

#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
#define LED_PIN1 2  // D2 strip 1
#define LED_PIN2 3  // D3 strip 2

#define TRIGGER_PIN 10     // D10 ultrasonic sensor Trigger pin (output)
#define ECHO_PIN 11        // D11 ultrasonic sensor Echo pin (input)
#define NUM_LEDS 200       // Leds per strip
#define NUM_STRIPS 2       // Number of strips
#define LEDS_TIMEOUT 5     // in minutes
#define TRACKER_TIMEOUT 2  // in seconds

CRGB leds[NUM_STRIPS][NUM_LEDS];

const char *ssid = "********";      // wifi SSID
const char *password = "********";  // wifi password

uint32_t startLedsTimeout = 0;     // for leds timeout
uint32_t startTrackerTimeout = 0;  // for tracker timeout
bool currentAnimation = false;     // enabled when animation is running
bool currentTracker = false;       // enabled when ultrasonic sensor is active
bool disableTracker = false;       // disable/enable tracker

WiFiWebServer server(80);

/*
* Run animation if ultrasonic sensor is high
*/
void handleTracker(float distanceOrig = 0) {
  static bool started = false;
  float duration, distance;

  if (distanceOrig != 0) {
    distance = distanceOrig;
  }

  currentTracker = true;
  if (distanceOrig == 0) {
    digitalWrite(TRIGGER_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIGGER_PIN, LOW);
    duration = pulseIn(ECHO_PIN, HIGH);
    distance = duration / 58;  // ~ duration * .0343 / 2
  }
  if (distance <= NUM_LEDS) {
    started = true;
    if (distanceOrig == 0) {
      distance = NUM_LEDS - distance;
    }
    byte start = (byte)((NUM_LEDS - distance) / 2);
    byte end = NUM_LEDS - start;
    for (byte i = 0; i < NUM_LEDS; i++) {
      leds[0][i] = (i >= start && i < end) ? CRGB::Gold1 : 0;
    }
    FastLED.show();
  } else {
    if (started) {
      startTrackerTimeout = millis();
      started = false;
    }
    currentTracker = false;
  }
}

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
  initTracker();
  //initMic();

  server.on("/leds", HTTP_GET, onServerEventLeds);
  server.on("/ruler", HTTP_GET, onServerEventRuler);
  server.on("/tracker", HTTP_GET, onServerEventTracker);
  server.begin();
}

/**
* Main loop
*/
void loop() {
  server.handleClient();

  handleTimeouts();

  if (!disableTracker && !startLedsTimeout && !currentAnimation) {
    handleTracker();
  }
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
* Ultrasonic sensor initialization
*/
void initTracker() {
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIGGER_PIN, LOW);
}

///////////////////////////////// LOOP CHECKS /////////////////////////////////

/**
* Turn off all leds after TIMEOUT seconds
*/
void handleTimeouts() {
  if (startLedsTimeout && (millis() - startLedsTimeout >= LEDS_TIMEOUT * 60 * 1000)) {
    FastLED.clear(true);
    startLedsTimeout = 0;
  }

  if (startTrackerTimeout && (millis() - startTrackerTimeout >= TRACKER_TIMEOUT * 1000)) {
    startTrackerTimeout = 0;
    if (!currentTracker && !currentAnimation && !startLedsTimeout) {
      FastLED.clear(true);
    }
  }
}

//////////////////////////// WEB SERVER EVENTS ////////////////////////////////

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

    FastLED.clear(true);
    startLedsTimeout = 0;
  } else {
    startLedsTimeout = millis();
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

  if (reset) {
    FastLED.clear(true);
    startLedsTimeout = 0;
  } else {
    startLedsTimeout = millis();
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
    FastLED.show();
  }
  server.send(200);
}

/**
* Server event to disable/enable tracker.
*
* @param disable int 1/0 to disable/enable
*/
void onServerEventTracker() {
  disableTracker = (bool)server.arg("disable").equals("1");
  server.send(200);
}

////////////////////////////////// UTILS //////////////////////////////////////

/**
* Little leds animation
*/
void runAnimation() {
  currentAnimation = true;
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
  FastLED.clear(true);
  currentAnimation = false;
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
