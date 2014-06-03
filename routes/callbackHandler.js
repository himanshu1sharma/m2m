var fnRouter  = require('./piRouter.js');

exports.index = function(data,callback) {
	console.log('Callback Handler');
	try{
		if(data.sobject){
			handleFlashingLight(data.sobject.Raspberry_GPIO__c);
		console.log(data.sobject);
		} else throw exception;
	} catch(err) {
		callback();
	} 
}

function handleFlashingLight(value) {
	var request = new Object();
  	request.body = {"pin":7};
	
	if(value == true){
		fnRouter.turnON(request,function(results){
			console.log('Pin ON');
		});
	} else if(value == false) {
		fnRouter.turnOff(request,function(results){
			console.log('Pin OFF');
		});
	}

}

exports.allGood = function() {

	if(interval == undefined) interval = 500;
	//set default time for blinkTime
	//number of times to blink the light on and off
	if(blinkTime == undefined) blinkTime = 5;

	var request = new Object();
  	request.body = {"pin":11};

  	var flag = false;

  	var intrvl = setInterval(function(request){
  		if(!flag){
	  		fnRouter.turnON(request,function(results){
				// console.log('Good Pin ON');
			});
		} else {
			fnRouter.turnOff(request,function(results){
				// console.log('Good Pin O');
			});
		}
  	},2000);

	console.log('Turning Green Light On');
	
	
}