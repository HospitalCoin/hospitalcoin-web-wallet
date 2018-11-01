


import {DestructableView} from "../lib/numbersLab/DestructableView";
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {AppState} from "../model/AppState";
import {Password} from "../model/Password";
import {Wallet} from "../model/Wallet";
import {KeysRepository} from "../model/KeysRepository";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {BlockchainExplorerRpc2} from "../model/blockchain/BlockchainExplorerRpc2";

AppState.enableLeftMenu();

let blockchainExplorer : BlockchainExplorerRpc2 = BlockchainExplorerProvider.getInstance();

class ImportView extends DestructableView{
	@VueVar(false) viewOnly : boolean;

	@VueVar('') privateSpendKey : string;
	@VueVar(false) validPrivateSpendKey : boolean;
	@VueVar('') privateViewKey : string;
	@VueVar(false) validPrivateViewKey : boolean;
	@VueVar('') publicAddress : string;
	@VueVar(false) validPublicAddress : boolean;

	@VueVar('') password : string;
	@VueVar('') password2 : string;
	@VueVar(false) insecurePassword : boolean;
	@VueVar(false) forceInsecurePassword : boolean;
	@VueVar(0) importHeight : number;

	constructor(container : string){
		super(container);
	}

	formValid(){
		if(this.password != this.password2)
			return false;

		if(!(this.password !== '' && (!this.insecurePassword || this.forceInsecurePassword)))
			return false;

		if(!(
			(!this.viewOnly && this.validPrivateSpendKey) ||
			(this.viewOnly && this.validPublicAddress && this.validPrivateViewKey)
		))
			return false;
		return true;
	}

	importWallet(){
		let self = this;
		blockchainExplorer.getHeight().then(function(currentHeight){
			let newWallet = new Wallet();
			if(self.viewOnly){
				let decodedPublic = cnUtil.decode_address(self.publicAddress);
				newWallet.keys = {
					priv:{
						spend:'',
						view:self.privateViewKey
					},
					pub:{
						spend:decodedPublic.spend,
						view:decodedPublic.view,
					}
				};
			}else {
				console.log(1);
				let viewkey = self.privateViewKey;
				if(viewkey === ''){
					viewkey = cnUtil.generate_keys(cnUtil.cn_fast_hash(self.privateSpendKey)).sec;
				}
				console.log(1, viewkey);
				newWallet.keys = KeysRepository.fromPriv(self.privateSpendKey, viewkey);
				console.log(1);
			}

			let height = self.importHeight;//never trust a perfect value from the user
			if(height >= currentHeight){
				height = currentHeight-1;
			}
			height = height - 10;

			if(height < 0)height = 0;
			newWallet.lastHeight = height;
			newWallet.creationHeight = newWallet.lastHeight;

			AppState.openWallet(newWallet, self.password);
			window.location.href = '#account';
		});
	}

	@VueWatched()
	passwordWatch(){
		if(!Password.checkPasswordConstraints(this.password, false)){
			this.insecurePassword = true;
		}else
			this.insecurePassword = false;
	}

	@VueWatched()
	importHeightWatch(){
		if(this.importHeight < 0){
			this.importHeight = 0;
		}
		this.importHeight = parseInt(''+this.importHeight);
	}

	@VueWatched()
	privateSpendKeyWatch(){
		this.validPrivateSpendKey = this.privateSpendKey.length == 64;
	}

	@VueWatched()
	privateViewKeyWatch(){
		this.validPrivateViewKey = this.privateViewKey.length == 64 || (!this.viewOnly && this.privateViewKey.length == 0);
	}

	@VueWatched()
	publicAddressWatch(){
		try{
			cnUtil.decode_address(this.publicAddress);
			this.validPrivateViewKey = true;
		}catch(e){
			this.validPrivateViewKey = false;
		}
	}

	forceInsecurePasswordCheck(){
		let self = this;
		self.forceInsecurePassword = true;
	}

}

new ImportView('#app');
