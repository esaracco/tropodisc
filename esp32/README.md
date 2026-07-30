# TropoDisc LED Controller

Firmware for the **ESP32-S3 Mini** used by **TropoDisc** to control addressable LED strips.

Once flashed, the board connects to your Wi-Fi network and exposes a simple HTTP API on port **80**. TropoDisc uses this API to illuminate the LEDs corresponding to the physical location of an album in your collection.

---

## Features

- ESP32-S3 Mini compatible
- HTTP REST API
- Control one or more LEDs
- RGB color support
- Optional incremental updates without resetting previous LEDs
- Designed for TropoDisc, but can be used independently

---

## Requirements

### Hardware

- ESP32-S3 Mini
- WS2812B (or compatible) LED strips

### Arduino IDE

Install the following packages before compiling:

#### Boards

- ESP32 by Espressif

#### Libraries

- FastLED
- WiFi
- WebServer

---

## Configuration

Before uploading the firmware, configure your Wi-Fi credentials:

```cpp
const char* ssid = "...";
const char* password = "...";
```

Compile and upload the project to your ESP32.

Once started, the board will listen for HTTP requests on port **80**.

---

# HTTP API

## Turn on LEDs

```
GET /leds
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `leds` | ✅ | Comma-separated list of LED indices. |
| `color` | ✅ | RGB color as `R,G,B` (0–255). |
| `noreset` | No | `1` to preserve the current LEDs before applying the new ones. |

### Example

```
GET /leds?leds=1,30,500&color=50,25,200
```

Turns on LEDs **1**, **30** and **500** using the RGB color `(50,25,200)`.

---

## Reset LEDs

```
GET /ruler
```

### Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `reset` | No | If set, turns all LEDs off. |

### Example

```
GET /ruler?reset=1
```

---

## Example workflow

```
TropoDisc
      │
      │ HTTP
      ▼
ESP32-S3 Mini
      │
      ▼
WS2812 LED strips
      │
      ▼
Highlighted album location
```

---

## License

This firmware is part of the **TropoDisc** project and is distributed under the GNU GPL v3 License.

