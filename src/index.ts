

import {Router} from "./lib/numbersLab/Router";
import {Mnemonic} from "./model/Mnemonic";

//bridge for cnUtil with the new mnemonic class
(<any>window).mn_random = Mnemonic.mn_random;
(<any>window).mn_encode = Mnemonic.mn_encode;
(<any>window).mn_decode = Mnemonic.mn_decode;

let isMenuHidden = $('body').hasClass('menuHidden');

function toggleMenu(){
	isMenuHidden = !isMenuHidden;
	console.log(isMenuHidden);
	if(isMenuHidden)
		$('body').addClass('menuHidden');
	else
		$('body').removeClass('menuHidden');
}

$('#menu a').on('click',function(event:Event){
	toggleMenu();
});
$('#menu').on('click',function(event:Event){
	event.stopPropagation();
});

$('#topBar .toggleMenu').on('click',function(event:Event){
	toggleMenu();
	event.stopPropagation();
	return false;
});

$(window).click(function() {
	isMenuHidden = true;
	$('body').addClass('menuHidden');
});

let router = new Router('./','../../');
window.onhashchange = function () {
	if("ga" in window) {
		(<any>window).GA('set', 'page', window.location.href);
		(<any>window).GA('send', 'pageview');
	}
	router.changePageFromHash();
};

if ('serviceWorker' in navigator) {
	const showRefreshUI = function(registration : any){
		console.log(registration);
		swal({
			type:'info',
			title:'A new version is available',
			html:'Do you want to reload to load the new version ?',
			confirmButtonText:'Yes',
			showCancelButton: true,
			cancelButtonText:'Latter',
		}).then(function(value : any){
			if(!value.dismiss){
				registration.waiting.postMessage('force-activate');
			}
		});
	};

	const onNewServiceWorker = function(registration:any, callback : Function){
		if (registration.waiting) {
			// SW is waiting to activate. Can occur if multiple clients open and
			// one of the clients is refreshed.
			return callback();
		}

		const listenInstalledStateChange = () => {
			registration.installing.addEventListener('statechange', (event : Event) => {
				if ((<any>event.target).state === 'installed') {
					// A new service worker is available, inform the user
					callback();
				}
			});
		};

		if (registration.installing) {
			return listenInstalledStateChange();
		}

		// We are currently controlled so a new SW may be found...
		// Add a listener in case a new SW is found,
		registration.addEventListener('updatefound', listenInstalledStateChange);
	};

	navigator.serviceWorker.addEventListener('message', (event) => {
		if (!event.data) {
			return;
		}

		switch (event.data) {
			case 'reload-window-update':
				window.location.reload(true);
				break;
			default:
				// NOOP
				break;
		}
	});

	navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
		// Track updates to the Service Worker.
		if (!navigator.serviceWorker.controller) {
			// The window client isn't currently controlled so it's a new service
			// worker that will activate immediately
			return;
		}

		console.log('on new service worker');
		onNewServiceWorker(registration, () => {
			showRefreshUI(registration);
		});
	});
}