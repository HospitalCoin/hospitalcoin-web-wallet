

import {WalletRepository} from "../model/WalletRepository";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Constants} from "../model/Constants";
import {BlockchainExplorerRpc2, WalletWatchdog} from "../model/blockchain/BlockchainExplorerRpc2";
import {VueRequireFilter, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Wallet} from "../model/Wallet";
import {BlockchainExplorer} from "../model/blockchain/BlockchainExplorer";
import {KeysRepository} from "../model/KeysRepository";
import {Observable, Observer} from "../lib/numbersLab/Observable";
import {VueFilterDate} from "../filters/Filters";
import {Mnemonic} from "../model/Mnemonic";
import {TransactionsExplorer} from "../model/TransactionsExplorer";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";

let injector = DependencyInjectorInstance();

let blockchainExplorer = BlockchainExplorerProvider.getInstance();

class IndexView extends DestructableView{
	@VueVar(false) hasLocalWallet : boolean;
	@VueVar(false) isWalletLoaded : boolean;

	constructor(container : string){
		super(container);
		this.isWalletLoaded = DependencyInjectorInstance().getInstance(Wallet.name,'default', false) !== null;
		this.hasLocalWallet = WalletRepository.hasOneStored();
		// this.importWallet();
		AppState.disableLeftMenu();
	}

	destruct(): Promise<void> {
		return super.destruct();
	}

	loadWallet(){
		let self = this;
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
						window.location.href = '#account';
					}else{
						swal({
							type: 'error',
							title: 'Oops...',
							text: 'Your password seems invalid',
						});
					}
				}
			}
			},1);
		});
	}

}

let newIndexView = new IndexView('#app');
