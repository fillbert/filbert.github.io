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
		.then(() => device.claimInterface(1)) // Request exclusive control over interface #2.
		.then(() => device.controlTransferOut({
			requestType: 'vendor',
			recipient: 'device',
			request: 0x01,
			value: 0x0100,
			index: 0x00})) // Ready to receive data
		.then(() => device.transferOut(4, 'KLJDSCKLSCNKLSCJNKLSCN')) // Waiting for 64 bytes of data from endpoint #5.
		.then(result => {
		  let decoder = new TextDecoder();
		  console.log('Received: ' + decoder.decode(result.data));
		})
		.catch(error => { console.log(error); });
	}


	 connectButton.addEventListener('click', function() {
        connectButton.textContent = 'Connect';
        statusDisplay.textContent = 'ZALUPA';
        connect();
		});
	});

})();