

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([]);

self.addEventListener('message', (event) => {
	if (!event.data){
		return;
	}

	switch (event.data) {
		case 'force-activate':
			(<any>self).skipWaiting();
			(<any>self).clients.claim();
			(<any>self).clients.matchAll().then((clients : any[]) => {
				clients.forEach((client : any) => client.postMessage('reload-window-update'));
			});
			break;
		default:
			// NOOP
			break;
	}
});