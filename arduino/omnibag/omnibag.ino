#include <Wire.h>
#include "Adafruit_TCS34725.h"

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define LED_PIN 13
#define PIN            9
#define NUMPIXELS      10

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

// set to false if using a common cathode LED
#define commonAnode true

// our RGB -> eye-recognized gamma color
byte gammatable[256];

Adafruit_TCS34725 tcs = Adafruit_TCS34725(TCS34725_INTEGRATIONTIME_50MS, TCS34725_GAIN_4X);

#include <SoftwareSerial.h>
SoftwareSerial mySerial(0, 1);

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);
  pixels.begin(); // This initializes the NeoPixel library.

  if (tcs.begin()) {
    Serial.println("Found sensor");
  } else {
    Serial.println("No TCS34725 found ... check your connections");
    while (1); // halt!
  }
  pinMode(13, OUTPUT);
  for (int i=0; i<256; i++) {
    float x = i;
    x /= 255;
    x = pow(x, 2.5);
    x *= 255; 
    if (commonAnode) {
      gammatable[i] = 255 - x;
    } else {
      gammatable[i] = x;      
    }
  }
}
int r = 0, g = 0, b = 0;
void loop() {
  String c;
  char red[3] = "rr";
  char green[3] = "gg";
  char blue[3] = "bb";
  if (mySerial.available()) {
    c = mySerial.readStringUntil('\n');
    Serial.println( c );
    if( c == "TCS347" ) {
      uint16_t clear, red, green, blue;
      digitalWrite(13, HIGH);
      tcs.setInterrupt(false);
      delay(100);
      tcs.getRawData(&red, &green, &blue, &clear);
      tcs.setInterrupt(true);
      digitalWrite(13, LOW);
      uint32_t sum = clear;
      float rd, gn, bl;
      rd = red; rd /= sum;
      gn = green; gn /= sum;
      bl = blue; bl /= sum;
      rd *= 256; gn *= 256; bl *= 256;
      r = (int)rd;
      g = (int)gn;
      b = (int)bl;
    } else {
      String rH = c.substring(0,2);
      String gH = c.substring(2,4);
      String bH = c.substring(4,6);
      rH.toCharArray(red, 3);
      gH.toCharArray(green, 3);
      bH.toCharArray(blue, 3);
      r = StrToHex(red);
      g = StrToHex(green);
      b = StrToHex(blue);  
    }
    
    for(int i=0;i<NUMPIXELS;i++){
      pixels.setPixelColor(i, pixels.Color(r, g, b) );
    }
    pixels.show();
  }
}
int StrToHex(char str[])
{
  return (int) strtol(str, 0, 16);
}
