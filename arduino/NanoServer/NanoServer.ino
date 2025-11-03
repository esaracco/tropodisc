#include <WiFiWebServer.h>
#include <FastLED.h>

#undef WITH_SERIAL

#define LED_TYPE WS2812B
#define COLOR_ORDER GRB
#define LED_PIN1 2    // D2 strip 1
#define LED_PIN2 3    // D3 strip 2
#define NUM_LEDS 144  // Leds per strip
#define NUM_STRIPS 2  // Number of strips
#define TIMEOUT 5     // in minute

CRGB leds[NUM_STRIPS][NUM_LEDS];

const char *ssid = "********";      // wifi SSID
const char *password = "********";  // wifi password

uint32_t startTime = 0;

WiFiWebServer server(80);

void setup() {
#ifdef WITH_SERIAL
  Serial.begin(9600);
  while (!Serial) {
    delay(250);
  }
#endif

  //createAccessPoint();
  connectWiFi();
  initStrips();

  server.on("/leds", HTTP_GET, handleLeds);
  server.on("/ruler", HTTP_GET, handleRuler);

  server.begin();
}

void loop() {
  server.handleClient();
  if (startTime && (millis() - startTime >= TIMEOUT * 60 * 1000)) {
    startTime = 0;
    FastLED.clear(true);
  }
}

void connectWiFi() {
  while (WiFi.begin(ssid, password) != WL_CONNECTED) {
    delay(250);
  }

#ifdef WITH_SERIAL
  Serial.print("WiFi OK on ");
  Serial.println(WiFi.localIP());
#endif
}

void initStrips() {
  FastLED.addLeds<LED_TYPE, LED_PIN1, COLOR_ORDER>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, LED_PIN2, COLOR_ORDER>(leds[1], NUM_LEDS);
  FastLED.setBrightness(10);
}

void handleLeds() {
  const byte noReset = server.arg("noreset") ? server.arg("noreset") == "1" : 0;
  int *ledsValues = getValues(server.arg("leds"));
  int *colorValues = getValues(server.arg("color"));

  if (!ledsValues) {
    startTime = 0;
    FastLED.clear(true);
    server.send(200);
    return;
  }

  if (!colorValues) {
    const int defaultColorValues[] = { 25, 25, 25, 0 };
    const int length = 4 * sizeof(int);
    colorValues = (int *)malloc(length);
    memcpy(colorValues, defaultColorValues, length);
  }

#ifdef WITH_SERIAL
  String remoteIP = server.client().remoteIP().toString();
  String response = server.arg("leds") + "|" + server.arg("color");
  response += " " + remoteIP;
  Serial.println(response);
#endif

  const byte R = *colorValues;
  const byte G = *(colorValues + 1);
  const byte B = *(colorValues + 2);
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
  FastLED.show();
  startTime = millis();
  free(colorValues);
  free(ledsValues);
  server.send(200);
}
void handleRuler() {
  byte reset = server.arg("reset") ? server.arg("reset") == "1" : 0;
  startTime = 0;
  FastLED.clear();
  if (!reset) {
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
  }
  FastLED.show();
  server.send(200);
}

int *getValues(String _buf) {
  if (!_buf || !_buf.length()) return NULL;
  char buf[_buf.length() + 2] = { 0 };
  int *ret = NULL;
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
