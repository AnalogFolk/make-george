  // Characters
   
  byte happy[8]={
    B00000000,
    B00100110,
    B01000110,
    B01000000,
    B01000000,
    B01000110,
    B00100110,
    B00000000
  };
  
  byte happyL[8]={
    B00000000,
    B00100110,
    B01000000,
    B01000000,
    B01000000,
    B01000110,
    B00100000,
    B00000000
  };
  
  byte happyR[8]={
    B00000000,
    B00100000,
    B01000110,
    B01000000,
    B01000000,
    B01000000,
    B00100110,
    B00000000
  };
   
  byte sad[8]={
    B00000000,
    B01000110,
    B00100110,
    B00100000,
    B00100000,
    B00100110,
    B01000110,
    B00000000
  };
  
  byte sadL[8]={
    B00000000,
    B01000110,
    B00100000,
    B00100000,
    B00100000,
    B00100110,
    B01000000,
    B00000000
  };
  
  byte sadR[8]={
    B00000000,
    B01000000,
    B00100110,
    B00100000,
    B00100000,
    B00100000,
    B01000110,
    B00000000
  };
  
  byte over[8]={
    B00000000,
    B00100110,
    B01010110,
    B01010000,
    B01010000,
    B01010110,
    B00100110,
    B00000000
  };

  byte dying[8]={
    B00000000,
    B00000100,
    B10000100,
    B01000000,
    B01000000,
    B10000100,
    B00000100,
    B00000000
  };
  
#include <OneWire.h>
OneWire  ds(2);
float fahrenheit, celsius;

void calculateTemp(){
  byte i;
  byte present = 0;
  byte type_s;
  byte data[12];
  byte addr[8];
    
  if ( !ds.search(addr)) {
    ds.reset_search();
    delay(1000);
    return;
  }
  
  if (OneWire::crc8(addr, 7) != addr[7]) {
      return;
  }
   
  switch (addr[0]) {
    case 0x10:
      type_s = 1;
      break;
    case 0x28:
      type_s = 0;
      break;
    case 0x22:
      type_s = 0;
      break;
    default:
      Serial.println("Device is not a DS18x20 family device.");
      return;
  }
  
  ds.reset();
  ds.select(addr);
  ds.write(0x44,1);
    
  delay(1000);
    
  present = ds.reset();
  ds.select(addr);   
  ds.write(0xBE);         // Read Scratchpad
  
  for ( i = 0; i < 9; i++) {           // we need 9 bytes
    data[i] = ds.read();
  }
  
  // convert the data to actual temperature
  unsigned int raw = (data[1] << 8) | data[0];
  if (type_s) {
    raw = raw << 3; // 9 bit resolution default
    if (data[7] == 0x10) {
      // count remain gives full 12 bit resolution
      raw = (raw & 0xFFF0) + 12 - data[6];
    }
  } else {
    byte cfg = (data[4] & 0x60);
    if (cfg == 0x00) raw = raw << 3;  // 9 bit resolution, 93.75 ms
    else if (cfg == 0x20) raw = raw << 2; // 10 bit res, 187.5 ms
    else if (cfg == 0x40) raw = raw << 1; // 11 bit res, 375 ms
    // default is 12 bit resolution, 750 ms conversion time
  }
  celsius = (float)raw / 16.0;
  fahrenheit = celsius * 1.8 + 32.0;
}
 
#include "LedControlMS.h"
LedControl lc=LedControl(12,11,10,1);
 
void draw(byte h[]){
  lc.setRow(0,0,h[0]);
  lc.setRow(0,1,h[1]);
  lc.setRow(0,2,h[2]);
  lc.setRow(0,3,h[3]);
  lc.setRow(0,4,h[4]);
  lc.setRow(0,5,h[5]);
  lc.setRow(0,6,h[6]);
  lc.setRow(0,7,h[7]);
}

// PINS
int motion1_pin = 3;
int motion2_pin = 4;
int soil_pin = 0;
int light_pin = 1;

// VALUES
int motion1_val = 0;
int motion2_val = 0;
int soil_val = 0;
int light_val = 0;

void setup(){
  pinMode(motion1_pin, INPUT);
  pinMode(motion2_pin, INPUT);
  
  // LCD wakeup
  lc.shutdown(0,false);
  // LCD brightness
  lc.setIntensity(0,1);
  // LCD clear display
  lc.clearDisplay(0);
  
  Serial.begin(9600);
}

void loop(){
  motion1_val = digitalRead(motion1_pin);
  motion2_val = digitalRead(motion2_pin);
  soil_val = map(analogRead(soil_pin), 0, 1023, 100, 0);
  light_val = map(analogRead(light_pin), 0, 512, 100, 0);
  
  calculateTemp();

  if(soil_val < 25 || celsius > 30 || celsius < 15) {
    draw(dying);
  } else if(soil_val > 75) {
    draw(over);
  } else if(light_val >= 30 && soil_val >= 66 && celsius >= 18 && celsius <= 26) {
    if(motion1_val == 1 && motion2_val == 0) {
      draw(happyL);
    } else if(motion1_val == 0 && motion2_val == 1) {
      draw(happyR);
    } else {
      draw(happy);
    } 
  } else {
    if(motion1_val == 1 && motion2_val == 0) {
      draw(sadL);
    } else if(motion1_val == 0 && motion2_val == 1) {
      draw(sadR);
    } else {
      draw(sad);
    } 
  }
  
  // form a JSON-formatted string:
  String jsonString = "{\"motion1\":\"";
  jsonString += motion1_val;
  jsonString +="\",\"motion2\":\"";
  jsonString += motion2_val;
  jsonString +="\",\"moisture\":\"";
  jsonString += soil_val;
  jsonString +="\",\"light\":\"";
  jsonString += light_val;
  jsonString +="\",\"temperature\":\"";
  jsonString += int(celsius);
  jsonString +="\"}";

  // print it:
  Serial.println(jsonString);
  
}
