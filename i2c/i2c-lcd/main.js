'use strict';

window.addEventListener('load', function() {
  var text = document.getElementById("_text");
  navigator.requestI2CAccess().then((i2cAccess) => {
    var port = i2cAccess.ports.get(1);
    var lcd = new Lcd(port, 0x3e);
    lcd.init().then(() => {
      setInterval(() => {
        lcd.setContrast(60);
        lcd.drawString(text.value);
      }, 1000);
    });
  }).catch(e => console.error('error', e));
}, false);
