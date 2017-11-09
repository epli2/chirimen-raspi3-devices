'use strict';

window.addEventListener('load', function (){
  var head = document.querySelector('#head');
  navigator.requestI2CAccess().then((i2cAccess)=>{
    var port = i2cAccess.ports.get(1);
    var groveADC = new GroveADC(port,0x50);
    groveADC.init().then(()=>{
      setInterval(()=>{
        groveADC.read().then((value)=>{
//          console.log('value:', value);
          head.innerHTML = value ? value : head.innerHTML;
        });
      },1000);
    });
  }).catch(e=> console.error('error', e));
}, false);
