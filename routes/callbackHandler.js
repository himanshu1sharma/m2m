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

exports.exceptionLed = function() {

	var request = new Object();
	request.body = {"pin":18};

	fnRouter.turnON(request,function(results){
	  			flag = true;
				// console.log('Good Pin ON');
			});

	console.log('Turning Red Light On');

	console.log('Turning green off');


	var requestGr = new Object();
	requestGr.body = {"pin":22};

	fnRouter.turnOff(requestGr,function(results){
	  			flag = true;
				// console.log('Good Pin ON');
			});

	console.log('Turning Green Light Off');


}

exports.allGood = function() {

	var request = new Object();
	request.body = {"pin":22};

	fnRouter.turnON(request,function(results){
	  			flag = true;
				// console.log('Good Pin ON');
			});

	console.log('Turning Green Light On');

	var requestRe = new Object();
	requestRe.body = {"pin":18};

	fnRouter.turnOff(requestRe,function(results){
	  			flag = true;
				// console.log('Good Pin ON');
			});

	console.log('Turning Red Light Off');
	
	
}