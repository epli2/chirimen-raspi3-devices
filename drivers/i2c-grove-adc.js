// Source: http://wiki.seeed.cc/Grove-I2C_ADC/

const GROVE_ADC_REGS = {
  ADDR_RESULT: 0x00,
  ADDR_ALERT: 0x01,
  ADDR_CONFIG: 0x02,
  ADDR_LIMITL: 0x03,
  ADDR_LIMITH: 0x04,
  ADDR_HYST: 0x05,
  ADDR_CONVL: 0x06,
  ADDR_CONVH: 0x07
}

var GroveADC = function(i2cPort, slaveAddress) {
  this.i2cPort = i2cPort;
  this.i2cSlave = null;
  this.slaveAddress = slaveAddress;
};

GroveADC.prototype = {
  init: function() {
    return new Promise((resolve, reject) => {
      this.i2cPort.open(this.slaveAddress).then((i2cSlave) => {
        this.i2cSlave = i2cSlave;
        this.i2cSlave.write8(GROVE_ADC_REGS.ADDR_CONFIG, 0x20);
        console.log("init ok:"+this.i2cSlave);
        resolve();
      }, (err) => {
        console.log("GroveADC.init() Error: " + error.message);
        reject(err);
      });
    });
  },
  read: function() {
    return new Promise(async (resolve, reject) => {
      if (this.i2cSlave === null) {
        reject("i2cSlave Address does'nt yet open!");
      } else {
        this.i2cSlave.read16(GROVE_ADC_REGS.ADDR_RESULT).then((v) => {
          var a = ((v & 0x0f) << 8) & 0xfff;
          var b = v >> 8;
          var value = (a | b);
          console.log(value);
          console.log(value * 3.0 * 2/4096 + " V");
          resolve(value);
        }, (err) => {
          console.log("GroveADC.read Error: " + err.message);
          reject(err);
        });
      }
    });
  }
};