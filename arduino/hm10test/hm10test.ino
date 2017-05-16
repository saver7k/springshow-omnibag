#include <SoftwareSerial.h>
SoftwareSerial mySerial(0, 1);

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif

#define LED_PIN 13
#define PIN            9
#define NUMPIXELS      60

Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);
  mySerial.begin(9600);
  pixels.begin(); // This initializes the NeoPixel library.
}

void loop() {
  String c;
  char red[3] = "rr";
  char green[3] = "gg";
  char blue[3] = "bb";
  if (mySerial.available()) {
    c = mySerial.readStringUntil('\n');
    String rH = c.substring(0,2);
    String gH = c.substring(2,4);
    String bH = c.substring(4,6);
    rH.toCharArray(red, 3);
    gH.toCharArray(green, 3);
    bH.toCharArray(blue, 3);
    Serial.println("Got input:");
    Serial.println( c );
    Serial.println( red );
    Serial.println( StrToHex(red) );
    Serial.println( StrToHex(green) );
    Serial.println( StrToHex(blue) );
    for(int i=0;i<NUMPIXELS;i++){
        if( i % 3 == 0 ){
            pixels.setPixelColor(i, pixels.Color(StrToHex(red),StrToHex(green),StrToHex(blue)));
        }
    }
    pixels.show();
  }
}
int StrToHex(char str[])
{
  return (int) strtol(str, 0, 16);
}
