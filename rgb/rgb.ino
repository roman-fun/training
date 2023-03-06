#include <Adafruit_NeoPixel.h>
#define PIN  13
#define NUMPIXELS 64
Adafruit_NeoPixel strip (NUMPIXELS, 13, NEO_GRB + NEO_KHZ800);


void setup() {
  strip.begin();
  strip.setBrightness(128);
  strip.clear();
  for (int i = 0; i < NUMPIXELS; i++) {
    int c = map(i, 0, NUMPIXELS - 1, 0, 255);
    strip.setPixelColor(i, strip.Color(0+c , 255, 0));
    //strip.setPixelColor(i, strip.Color(255 - c, 0, c));
  }
  strip.show();
}

void loop() {

}
