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

  	var flag = false;

  	var intrvl = setInterval(function(){
  		
  		var request = new Object();
  		request.body = {"pin":11};

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