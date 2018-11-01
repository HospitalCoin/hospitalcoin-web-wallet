

import {WalletRepository} from "./model/WalletRepository";

function sendMessageToParent(type : string, data : any){
	window.parent.postMessage({
		type:type,
		payload:data
	}, '*');
}

window.addEventListener('message', function(e : MessageEvent){
	console.log(e);
	if(e.data == 'hasWallet'){
		sendMessageToParent('hasWallet', WalletRepository.hasOneStored());
	}
});

sendMessageToParent('ready', null);