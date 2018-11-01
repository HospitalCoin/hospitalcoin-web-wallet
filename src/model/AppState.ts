

import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {WalletWatchdog} from "./blockchain/BlockchainExplorerRpc2";
import {Wallet} from "./Wallet";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Observable} from "../lib/numbersLab/Observable";
import {WalletRepository} from "./WalletRepository";

export class WalletWorker{
	wallet : Wallet;
	password : string;

	intervalSave = 0;

	constructor(wallet: Wallet, password:string) {
		this.wallet = wallet;
		this.password = password;
		let self = this;
		wallet.addObserver(Observable.EVENT_MODIFIED, function(){
			if(self.intervalSave === 0)
				self.intervalSave = setTimeout(function(){
					self.save();
					self.intervalSave = 0;
				}, 1000);
		});

		this.save();
	}

	save(){
		WalletRepository.save(this.wallet, this.password);
	}
}

export class AppState{

	static openWallet(wallet : Wallet, password:string){
		let walletWorker = new WalletWorker(wallet, password);

		DependencyInjectorInstance().register(Wallet.name,wallet);
		let watchdog = BlockchainExplorerProvider.getInstance().watchdog(wallet);
		DependencyInjectorInstance().register(WalletWatchdog.name,watchdog);
		DependencyInjectorInstance().register(WalletWorker.name,walletWorker);

		$('body').addClass('connected');
		if(wallet.isViewOnly())
			$('body').addClass('viewOnlyWallet');
	}

	static disconnect(){
		let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
		let walletWorker : WalletWorker = DependencyInjectorInstance().getInstance(WalletWorker.name,'default', false);
		let walletWatchdog : WalletWatchdog = DependencyInjectorInstance().getInstance(WalletWatchdog.name,'default', false);
		if(walletWatchdog !== null)
			walletWatchdog.stop();

		DependencyInjectorInstance().register(Wallet.name,undefined,'default');
		DependencyInjectorInstance().register(WalletWorker.name,undefined,'default');
		DependencyInjectorInstance().register(WalletWatchdog.name,undefined,'default');
		$('body').removeClass('connected');
		$('body').removeClass('viewOnlyWallet');
	}

	private static leftMenuEnabled = false;
	static enableLeftMenu(){
		if(!this.leftMenuEnabled) {
			this.leftMenuEnabled = true;
			$('body').removeClass('menuDisabled');
		}
	}
	static disableLeftMenu(){
		if(this.leftMenuEnabled) {
			this.leftMenuEnabled = false;
			$('body').addClass('menuDisabled');
		}
	}

	static askUserOpenWallet(redirectToHome:boolean=true){
		let self = this;
		return new Promise<void>(function (resolve, reject) {
			swal({
				title: 'Wallet password',
				input: 'password',
				showCancelButton: true,
				confirmButtonText: 'Open',
			}).then((result:any) => {
				setTimeout(function(){//for async
					if (result.value) {
						let savePassword = result.value;
						// let password = prompt();
						let memoryWallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
						if(memoryWallet === null){
							// let wallet = WalletRepository.getMain();
							let wallet = WalletRepository.getLocalWalletWithPassword(savePassword);
							if(wallet !== null) {
								wallet.recalculateIfNotViewOnly();
								AppState.openWallet(wallet, savePassword);
								if(redirectToHome)
									window.location.href = '#account';
								resolve();
							}else{
								swal({
									type: 'error',
									title: 'Oops...',
									text: 'Your password seems invalid',
								});
								reject();
							}
						}
					}else
						reject();
				},1);
			});
		});
	}


}