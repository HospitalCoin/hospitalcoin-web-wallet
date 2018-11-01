

import {VueClass, VueRequireFilter, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {VueFilterDate, VueFilterPiconero} from "../filters/Filters";
import {AppState} from "../model/AppState";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);

@VueRequireFilter('date',VueFilterDate)
@VueRequireFilter('piconero',VueFilterPiconero)
class AccountView extends DestructableView{
	@VueVar([]) transactions : any[];
	@VueVar(0) walletAmount : number;
	@VueVar(0) unlockedWalletAmount : number;

	@VueVar(0) currentScanBlock : number;
	@VueVar(0) blockchainHeight : number;

	intervalRefresh : number = 0;

	constructor(container : string){
		super(container);
		let self = this;
		AppState.enableLeftMenu();
		this.intervalRefresh = setInterval(function(){
			self.refresh();
		}, 1*1000);
		this.refresh();
	}

	destruct(): Promise<void> {
		clearInterval(this.intervalRefresh);
		return super.destruct();
	}

	refresh(){
		let self = this;
		blockchainExplorer.getHeight().then(function(height : number){
			self.blockchainHeight = height;
		});
		// self.blockchainHeight = blockchainExplorer.getScannedHeight();

		// if(this.currentScanBlock === 0){
			this.refreshWallet();
		// }

		//save wallet if modified
		// if(wallet.hasBeenModified()){
		// 	this.refreshWallet();
			// let walletExported = wallet.exportToRaw();
			// window.localStorage.setItem('wallet', JSON.stringify(walletExported));
		// }
	}

	refreshWallet(){
		this.currentScanBlock = wallet.lastHeight;
		this.walletAmount = wallet.amount;
		this.unlockedWalletAmount = wallet.unlockedAmount(this.currentScanBlock);
		if(wallet.getAll().length+wallet.txsMem.length !== this.transactions.length) {
			this.transactions = wallet.txsMem.concat(wallet.getTransactionsCopy().reverse());
		}
	}
}

if(wallet !== null && blockchainExplorer !== null)
	new AccountView('#app');
else
	window.location.href = '#index';