// Source: https://www.switch-science.com/catalog/1407/

var Lcd = function(i2cPort, slaveAddress) {
  this.i2cPort = i2cPort;
  this.i2cSlave = null;
  this.slaveAddress = slaveAddress;
  this.contrast = 35;
};

Lcd.prototype = {
  init: function() {
    return new Promise((resolve, reject) => {
      this.i2cPort.open(this.slaveAddress).then((i2cSlave) => {
        this.i2cSlave = i2cSlave;
        this.i2cSlave.write8(0x00, 0b00111000); // function set
        this.i2cSlave.write8(0x00, 0b00111001); // function set
        this.i2cSlave.write8(0x00, 0b00000100); // EntryModeSet
        this.i2cSlave.write8(0x00, 0b00010100); // interval osc
        this.i2cSlave.write8(0x00, 0b01110000 | (this.contrast & 0xF)); // contrast Low
        this.i2cSlave.write8(0x00, 0b01011100 | ((this.contrast >> 4) & 0x3)); // contast High/icon/power
        this.i2cSlave.write8(0x00, 0b01101100); // follower control

        this.i2cSlave.write8(0x00, 0b00111000); // function set
        this.i2cSlave.write8(0x00, 0b00001100); // Display On
        this.i2cSlave.write8(0x00, 0b00000001); // Clear Display
        console.log("init ok:"+this.i2cSlave);
        resolve();
      }, (err) => {
        console.log("Lcd.init() Error: " + error.message);
        reject(err);
      });
    });
  },
  clearDisplay: function() {
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave === null) {
        reject("i2cSlave Address des'nt yet open!");
      } else {
        await this.i2cSlave.write8(0x00, 0x01);
      }
    });
  },
  drawString: function(str) {
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave === null) {
        reject("i2cSlave Address does'nt yet open!");
      } else if (str.length > 16) {
        reject("string must be shorter than 16 characters!");
      } else {
        this.clearDisplay().catch(e => {
          reject(e);
        });
        await this.i2cSlave.write8(0x00, 0x80);
        for (var i = 0; i < str.length; i++) {
          if (i === 8) {
            await this.i2cSlave.write8(0x00, 0x80 | 0x40);
          }
          if (i === str.length - 1) {
            await this.i2cSlave.write8(0b01000000, str.charAt(i).charCodeAt());
          } else {
            await this.i2cSlave.write8(0b11000000, str.charAt(i).charCodeAt());
          }
        }
      }
    });
  },
  setContrast: function(contrast) {
    this.contrast = contrast;
    this.init();
  }
};
