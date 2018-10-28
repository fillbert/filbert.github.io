(function() {
  'use strict';

var device;


document.addEventListener('DOMContentLoaded', event => {
	let connectButton = document.querySelector("#connect");
	let statusDisplay = document.querySelector('#status');
	navigator.usb.addEventListener('connect', event => {
	  console.log('Connected');
	});

	navigator.usb.addEventListener('disconnect', event => {
	  console.log('Disconnected');
	}); 


	function connect (){
		navigator.usb.requestDevice({ filters: [{ vendorId: 0x0483 }] })
		.then(selectedDevice => {
		   device = selectedDevice;
		   return device.open(); // Begin a session.
		 })
		.then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
		.then(() => device.claimInterface(0)) // Request exclusive control over interface #2.
		.then(() => device.controlTransferOut({
			requestType: 'vendor',
			recipient: 'device',
			request: 34,
			value: 0x0003,
			index: 0x00})) // Ready to receive data
		//.then(() => device.transferOut(2, 'KLJDSCKLSCNKLSCJNKLSCN')) // Waiting for 64 bytes of data from endpoint #5.
		.then(result => {
		  let decoder = new TextDecoder();
		  console.log('Received: ' + decoder.decode(result.data));
		})
		.catch(error => { console.log(error); });
	}
	
	function disconnect (){
			return device.close();
	}
		

	 connectButton.addEventListener('click', function() {
		 	if (connectButton.textContent == 'Connect')
			{
				connectButton.textContent = 'Disconnect';
				connect();
			}
			else
			{
				connectButton.textContent = 'Connect';
				disconnect();
			}
		});
	//	connectButton.addEventListener('click', async () => {
	//	  let device;
	//	  try {
	//		device = await navigator.usb.requestDevice({ filters: [{
	//			vendorId: 0x0403
	//		}]});
	//	  } catch (err) {
	//		// No device was selected.
	//	  }
    //
	//	  if (device !== undefined) {
	//		// Add |device| to the UI.
	//		await device.open();
	//		if (device.configuration === null)
	//		  await device.selectConfiguration(1);
	//		await device.claimInterface(1);
	//	  }
	//	});
	});

})();