#include <WiFi.h>
#include <WebServer.h>
#include <FastLED.h>

/* ===================== CONFIG ===================== */

#define LED_TYPE WS2812B
#define COLOR_ORDER GRB

#define LED_PIN1 2
#define LED_PIN2 3

#define NUM_LEDS 200
#define NUM_STRIPS 2

#define WIFI_SSID "********"
#define WIFI_PASSWORD "********"

#define LED_WATCHDOG_TIMEOUT_MS (5 * 60 * 1000UL)

/* ===================== LEDS ===================== */

CRGB leds[NUM_STRIPS][NUM_LEDS];

/* ===================== LED WATCHDOG ===================== */

uint32_t ledWatchdogLastKick = 0;

void ledWatchdogKick() {
  ledWatchdogLastKick = millis();
}

void ledWatchdogClear() {
  ledWatchdogLastKick = 0;
}

void ledWatchdogCheck() {
  if (!ledWatchdogLastKick) return;

  if ((uint32_t)(millis() - ledWatchdogLastKick) >= LED_WATCHDOG_TIMEOUT_MS) {
    FastLED.clear(true);
    ledWatchdogClear();
  }
}

/* ===================== WEB SERVER ===================== */

WebServer server(80);

/* ===================== UTILS ===================== */

bool parseColor(const String& s, uint8_t& r, uint8_t& g, uint8_t& b) {
  int ri, gi, bi;
  if (sscanf(s.c_str(), "%d,%d,%d", &ri, &gi, &bi) != 3) return false;
  r = constrain(ri, 0, 255);
  g = constrain(gi, 0, 255);
  b = constrain(bi, 0, 255);
  return true;
}

/* ===================== LED LOGIC ===================== */

void runAnimation() {
  for (int pass = 0; pass < 2; pass++) {
    for (int strip = 0; strip < NUM_STRIPS; strip++) {
      int s = pass ? (NUM_STRIPS - 1) - strip : strip;
      for (int i = 0; i < NUM_LEDS; i++) {
        if (i % 5 == 0) {
          FastLED.clear();
          leds[s][pass ? (NUM_LEDS - 1 - i) : i] = CRGB::DarkOrange;
          FastLED.show();
          yield();
        }
      }
    }
  }
  FastLED.clear(true);
  ledWatchdogClear();
}

/* ===================== HTTP HANDLERS ===================== */

void onServerEventLeds() {
  uint8_t r, g, b;

  ledWatchdogClear();
  if (!server.hasArg("leds") || server.arg("color") == "0,0,0" || !parseColor(server.arg("color"), r, g, b)) {
    FastLED.clear(true);
  } else {
    const String& s = server.arg("leds");
    char buf[s.length() + 1];
    s.toCharArray(buf, sizeof(buf));

    char* save;
    char* tok = strtok_r(buf, ",", &save);

    if (!(server.arg("noreset") && server.arg("noreset") == "1")) {
      FastLED.clear();
    }
    while (tok) {
      int pos = atoi(tok);
      if (pos >= 1 && pos <= NUM_STRIPS * NUM_LEDS) {
        pos--;
        leds[pos / NUM_LEDS][pos % NUM_LEDS].setRGB(r, g, b);
      }
      tok = strtok_r(NULL, ",", &save);
    }
    FastLED.show();
    ledWatchdogKick();
  }

  server.send(200);
}

void onServerEventRuler() {
  ledWatchdogClear();
  if (server.hasArg("reset") && server.arg("reset") == "1") {
    FastLED.clear(true);
  } else {
    FastLED.clear();
    for (uint8_t strip = 0; strip < NUM_STRIPS; strip++) {
      for (int i = 1; i <= NUM_LEDS; i++) {
        if (i % 10 == 0)
          leds[strip][i - 1] = CRGB::Blue;
        else if (i % 5 == 0)
          leds[strip][i - 1] = CRGB::White;
      }
    }
    FastLED.show();
  }
  server.send(200);
}

/* ===================== SETUP / LOOP ===================== */

void setup() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(200);
  }

  FastLED.addLeds<LED_TYPE, LED_PIN1, COLOR_ORDER>(leds[0], NUM_LEDS);
  FastLED.addLeds<LED_TYPE, LED_PIN2, COLOR_ORDER>(leds[1], NUM_LEDS);
  FastLED.setBrightness(10);

  server.on("/leds", HTTP_GET, onServerEventLeds);
  server.on("/ruler", HTTP_GET, onServerEventRuler);
  server.begin();

  runAnimation();
}

void loop() {
  server.handleClient();
  ledWatchdogCheck();
}
