#include <SoftwareSerial.h>
#define LED_PIN 13

SoftwareSerial mySerial(0, 1); // RX, TX  
// Connect HM10      Arduino Uno
//     Pin 1/TXD          Pin 7
//     Pin 2/RXD          Pin 8
bool blinking = false;

void setup() {  
  Serial.begin(9600);
  // If the baudrate of the HM-10 module has been updated,
  // you may need to change 9600 by another value
  // Once you have found the correct baudrate,
  // you can update it using AT+BAUDx command 
  // e.g. AT+BAUD0 for 9600 bauds
  mySerial.begin(9600);
}

void loop() {  
  String c;
  
  if (mySerial.available()) {
    c = mySerial.readStringUntil('\n');  
    Serial.println("Got input:");
    if (c == "ON")
    {
      // Non-zero input means "turn on LED".
      Serial.println("  on");
      digitalWrite(LED_PIN, HIGH);
      blinking = false;
    } else if( c == "BLINK" ) {
       blinking = true;
    }
    else
    {
      // Input value zero means "turn off LED".
      Serial.println("  off");
      digitalWrite(LED_PIN, LOW);
      blinking = false;
    }  
  }

  if( blinking ) {
    digitalWrite(LED_PIN, HIGH);
    delay(200);
    digitalWrite(LED_PIN, LOW);
    delay(300);
  }
}
