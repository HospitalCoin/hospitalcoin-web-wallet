

var HospApi = new function(){

	this.ready = false;
	this.apiDomain = 'http://localhost:38090';
	this.timeoutErrorTime = 10000;
	this.timeoutError = 10000;

	var self = this;

	this.promisesResolves = {};
	this.promisesReject = {};

	this.iframe = null;
	this.popupParameters = undefined;
	// this.popupParameters = "menubar=no, status=no, scrollbars=no, menubar=no, width=200, height=100";

	this.registerPromise = function(eventName, resolve, reject){
		this.promisesReject[eventName] = reject;
		this.promisesResolves[eventName] = resolve;
	};

	this.unregisterPromise = function(eventName){
		if(typeof this.promisesReject[eventName] !== 'undefined') delete this.promisesReject[eventName];
		if(typeof this.promisesResolves[eventName] !== 'undefined') delete this.promisesResolves[eventName];
	};

	this.init  = function(){
		window.addEventListener('message', function(e){
			if(e.origin === self.apiDomain){
				console.log(e);
				var eventType = e.data.type;
				var eventData = e.data.payload;
				console.log('event type:',eventType);
				// if(eventType === 'ready'){
					self.promisesResolves[eventType](eventData);
					self.unregisterPromise(eventType);
				// }
			}
		});

		return new Promise(function(resolve, reject){
			self.registerPromise('ready', resolve, reject);
			var ifrm = document.createElement("iframe");
			ifrm.setAttribute("src", self.apiDomain+"/api.html");
			ifrm.style.width = "0";
			ifrm.style.height = "0";
			ifrm.style.display = 'none';

			self.timeoutError = setTimeout(function(){
				self.promisesReject['ready'](eventData);
				self.unregisterPromise('ready');
			},self.timeoutErrorTime);

			ifrm.addEventListener('load', function(){
				clearTimeout(self.timeoutError);
				self.timeoutError = 0;
			});

			self.iframe = ifrm;
			document.body.appendChild(ifrm);
		});
	};

	this.hasWallet = function(){
		return new Promise(function(resolve, reject){
			self.registerPromise('hasWallet', resolve, reject);
			self.iframe.contentWindow.postMessage('hasWallet', '*');
		});
	};

	this.makeTransfer = function(options){
		var url = this.apiDomain+'/#!send?';
		if(typeof options.amount !== 'undefined')url += 'amount='+options.amount+'&';
		if(typeof options.address !== 'undefined')url += 'address='+options.address+'&';
		if(typeof options.description !== 'undefined')url += 'txDesc='+options.description+'&';
		if(typeof options.destName !== 'undefined')url += 'destName='+options.destName+'&';

		window.open(url,"HospitalCoin",this.popupParameters);

		return Promise.resolve();
	};

};