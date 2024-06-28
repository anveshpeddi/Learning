let socket;
$(function() {	
	// Handler for .ready() called.var url = $("#inputUrl").val();
	var url = $("#inputUrl").val();
	console.log("Connectiong to DDS server. URL is: " + url);
	
	if(isStringEmpty(url)) {
		showAlert("URL should not be Empty. Please Enter valid URL.");
		return;
	} 
	socket = new WebSocket(url);

	socket.onopen = function(e) {
		console.log("Connected to Server.");
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
		
		$("#response").val(time + "\tClient=" + e.target);
	};

	socket.onmessage = function(event) {
		var showResponseIn = $("#response");
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
		var ddsResponse = time + "\t" + event.data;
		
		showResponseIn.val(showResponseIn.val() + "\n" + ddsResponse);
		//document.getElementById("ddsResponse").value = ${event.data};
	};

	socket.onclose = function(event) {
		if (event.wasClean) {
			console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
		} else {
			console.log('[close] Connection died');
		}
		
		var showResponseIn = $("#response");
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
		var closeMsgWithTime = time + "\tServer closed. code=" + event.code + " reason=" + event.reason;
		
		showResponseIn.val(showResponseIn.val() + "\n" + closeMsgWithTime);
	};

	socket.onerror = function(error) {
		console.log(`[error] ${error.message}`);
		var showResponseIn = $("#response");
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
		var errorMsgWithTime = time + "\t" + error.message;
		
		showResponseIn.val(showResponseIn.val() + "\n" + errorMsgWithTime);
	};
});

function connectToServer() {
	var url = $("#inputUrl").val();
	console.log("Connectiong to DDS server. URL is: " + url);
    socket = new WebSocket(url);
}

function sendDomainRequest() {
	console.log("Sending domain initialization request.");
	var domain = $("#inputDomain").val();
	var replay = $("#inputReplay").val();
	if(isStringEmpty(domain) || isStringEmpty(replay)) {
		showAlert("Domain or Replay should not be Empty. Please Enter valid Domain or Replay.");
		return;
	}
	var showResponseIn = $("#response");
	
	var domainRequestJson = {
		"requestType": "domainInitRqst",
		"requestId": 1,
		"updateTime": 0,
		"options": 0,
		"requestData": [
			[
				"local",
				"0"
			],
			[
				"replay",
				"0"
			]
		]
	};

	//Replace domain and replay with user input values
	domainRequestJson.requestData[0][1] = domain;
	domainRequestJson.requestData[1][1] = replay;
	
	// Send the msg object as a JSON-formatted string.
	socket.send(JSON.stringify(domainRequestJson));
	
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
	var domainReqWithTime = time + "\tSent:" + JSON.stringify(domainRequestJson);
	
	showResponseIn.val(showResponseIn.val() + "\n" + domainReqWithTime);
}

function sendMachineSelectRequest() {
	console.log("Sending machine select request.");
	var machineId = $("#inputMachineId").val();
	var section = $("#inputSection").val();
	
	if(isStringEmpty(machineId) || isStringEmpty(section)) {
		showAlert("Machine Id or Section should not be Empty. Please Enter valid Machine Id or Section.");
		return;
	}
	var showResponseIn = $("#response");
	
	var machineSelectRequestJson = {
		"requestType": "machineSelectRqst",
		"requestId": 2,
		"updateTime": 0,
		"options": 0,
		"requestData": [
			[
				"sectionName",
				"*"
			],
			[
				"machineId",
				"1111"
			]
		]
	};
	
	//Replace section and machine id with  user input values
	machineSelectRequestJson.requestData[0][1] = section;
	machineSelectRequestJson.requestData[1][1] = machineId;
	
	// Send the msg object as a JSON-formatted string.
	socket.send(JSON.stringify(machineSelectRequestJson));
	
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
	var machineReqWithTime = time + "\tSent:" + JSON.stringify(machineSelectRequestJson);
	
	showResponseIn.val(showResponseIn.val() + "\n" + machineReqWithTime);
}

function sendRequest() {
	console.log("Sending user input request to server.");
	var requestJson = $("#request").val();
	if(isStringEmpty(requestJson)) {
		showAlert("Request should not be Empty. Please Enter valid Request json.");
		return;
	}
	
	// Send the msg object as a JSON-formatted string.
	console.log("Original json: " + requestJson);
	requestJson = requestJson.replace(/\s/g, '');
	console.log("Requested Json: " + requestJson);
	socket.send(requestJson);
	
	var showResponseIn = $("#response");
	var today = new Date();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds() + "." + today.getMilliseconds();
	var requestWithTime = time + "\tSent:" + requestJson;
	
	showResponseIn.val(showResponseIn.val() + "\n" + requestWithTime);
}

function closeSocket(){
	console.log("Connection to server closed.");
    socket.close();
}

function isStringEmpty(str)
{
    if (typeof str == 'undefined' || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g,"") === "") {
        return true;
    } else {
        return false;
	}
}

function showAlert(msg){
	$('.alert').css('display','block');
	$('.alert').text(msg);
	$('.alert').alert();
}