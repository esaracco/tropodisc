#include <WiFiWebServer.h>
#include <FastLED.h>

#undef WITH_SERIAL

#define LED_PIN1 2  //D2 Etage 1
#define LED_PIN2 3  //D3 Etage 2
#define LED_PIN3 4  //D4 Etage 3
#define LED_PIN4 5  //D5 Etage 4

#define NUM_LEDS 144
#define NUM_STRIPS 2
#define LED_TYPE WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_STRIPS][NUM_LEDS];

const char *ssid = "********";
const char *password = "********";

WiFiWebServer server(80);

void setup() {
#ifdef WITH_SERIAL
  Serial.begin(9600);
  delay(1000);
#endif

  connectWiFi();
  initStrips();

  server.on("/setLeds", HTTP_GET, handleSetLeds);
  server.on("/regle", handleRegle);
  server.begin();
}

void loop() {
  server.handleClient();
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

void handleRegle() {
  byte reset = server.arg("reset") ? server.arg("reset") == "1" : 0;

  FastLED.clear();

  if (!reset) {
    for (byte etage = 0; etage < NUM_STRIPS; etage++) {
      for (byte i = 0; i < NUM_LEDS; i++) {
        if (!i) continue;
        if (i % 10 == 0) {
          leds[etage][i - 1] = CRGB::Blue;
        } else if (i % 5 == 0) {
          leds[etage][i - 1] = CRGB::White;
        }
      }
    }
  }
  FastLED.show();

  server.send(200);
}

void handleSetLeds() {
  int *ledsValues = getValues(server.arg("leds"));
  int *colorValues = getValues(server.arg("color"));
  byte noReset = server.arg("noreset") ? server.arg("noreset") == "1" : 0;

#ifdef WITH_SERIAL
  Serial.println(noReset);
  Serial.println(server.arg("noreset"));
#endif

  if (!ledsValues || !colorValues) {
    FastLED.clear();
    FastLED.show();
    server.send(200);
    return;
  }

  /*
  String remoteIP = server.client().remoteIP().toString();
  String response = server.arg ("leds")+"|"+server.arg ("color");
  response += " "+remoteIP;
  */

  const byte R = *colorValues;
  const byte G = *(colorValues + 1);
  const byte B = *(colorValues + 2);

  if (!noReset) {
#ifdef WITH_SERIAL
    Serial.println("RESET!");
#endif
    FastLED.clear();
  }

  int *ptr = ledsValues;
  while (*ptr >= 0) {
    int position = *ptr - 1;
    int etage = abs((float)position / NUM_LEDS);
    int col = position - (NUM_LEDS * etage);

    leds[etage][col].setRGB(R, G, B);

    ++ptr;
  }

  FastLED.show();

  free(colorValues);
  free(ledsValues);

  server.send(200);
}

void initStrips() {
  FastLED.addLeds<LED_TYPE, LED_PIN1, COLOR_ORDER>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, LED_PIN2, COLOR_ORDER>(leds[1], NUM_LEDS);
  // FastLED.addLeds<LED_TYPE, LED_PIN3, COLOR_ORDER>(leds[2], NUM_LEDS),
  // FastLED.addLeds<LED_TYPE, LED_PIN4, COLOR_ORDER>(leds[3], NUM_LEDS),

  FastLED.setBrightness(10);
  FastLED.show();
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
