

import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {TransactionsExplorer} from "../model/TransactionsExplorer";
import {WalletRepository} from "../model/WalletRepository";
import {BlockchainExplorerRpc2, WalletWatchdog} from "../model/blockchain/BlockchainExplorerRpc2";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Constants} from "../model/Constants";
import {Wallet} from "../model/Wallet";
import {AppState, WalletWorker} from "../model/AppState";
import {Password} from "../model/Password";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name, 'default', false);
let blockchainExplorer : BlockchainExplorerRpc2 = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);
let walletWatchdog : WalletWatchdog = DependencyInjectorInstance().getInstance(WalletWatchdog.name,'default', false);

class ChangeWalletPasswordView extends DestructableView{
	@VueVar('') oldPassword : string;
	@VueVar(false) invalidOldPassword : boolean;

	@VueVar('') walletPassword : string;
	@VueVar('') walletPassword2 : string;
	@VueVar(false) insecurePassword : boolean;
	@VueVar(false) forceInsecurePassword : boolean;

	constructor(container : string){
		super(container);
	}

	@VueWatched()
	oldPasswordWatch(){
		let wallet = WalletRepository.getLocalWalletWithPassword(this.oldPassword);
		if(wallet !== null) {
			this.invalidOldPassword = false;
		}else
			this.invalidOldPassword = true;
	}

	forceInsecurePasswordCheck(){
		let self = this;
		self.forceInsecurePassword = true;
	}

	@VueWatched()
	walletPasswordWatch(){
		if(!Password.checkPasswordConstraints(this.walletPassword, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	changePassword(){
		let walletWorker : WalletWorker = DependencyInjectorInstance().getInstance(WalletWorker.name,'default', false);
		if(walletWorker !== null){
			walletWorker.password = this.walletPassword;
			walletWorker.save();

			swal({
				type:'success',
				title:'Password changed'
			});
			this.oldPassword = '';
			this.walletPassword = '';
			this.walletPassword2 = '';
			this.insecurePassword = false;
			this.forceInsecurePassword = false;
			this.invalidOldPassword = false;
		}
	}


}


if(wallet !== null && blockchainExplorer !== null)
	new ChangeWalletPasswordView('#app');
else
	window.location.href = '#index';
