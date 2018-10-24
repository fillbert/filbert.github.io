(function() {
  'use strict';

var device;


document.addEventListener('DOMContentLoaded', event => {
	let connectButton = document.querySelector("#connect");
	let statusDisplay = document.querySelector('#status');



	function connect (){
		navigator.usb.requestDevice({ filters: [{ vendorId: 0x0403 }] })
		.then(selectedDevice => {
		   device = selectedDevice;
		   return device.open(); // Begin a session.
		 })
		.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
		.then(() => device.claimInterface(2)) // Request exclusive control over interface #2.
		.then(() => device.controlTransferOut({
			requestType: 'class',
			recipient: 'interface',
			request: 0x22,
			value: 0x01,
			index: 0x02})) // Ready to receive data
		.then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5.
		.then(result => {
		  let decoder = new TextDecoder();
		  console.log('Received: ' + decoder.decode(result.data));
		})
		.catch(error => { console.log(error); });
	}


	 connectButton.addEventListener('click', function() {
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = '';;
        connect();
		});
	});

})();