
import {VueClass, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {WalletRepository} from "../model/WalletRepository";
import {Mnemonic} from "../model/Mnemonic";
import {CoinUri} from "../model/CoinUri";

let wallet : Wallet = DependencyInjectorInstance().getInstance(Wallet.name,'default', false);
let blockchainExplorer = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);


class ExportView extends DestructableView{
	@VueVar('') publicAddress: string;

	constructor(container : string){
		super(container);
		let self = this;

		this.publicAddress = wallet.getPublicAddress();
	}

	destruct(): Promise<void> {
		return super.destruct();
	}

	getPrivateKeys(){
		swal({
			title: 'Wallet password',
			input: 'password',
			showCancelButton: true,
			confirmButtonText: 'Export',
		}).then((result:any) => {
			if (result.value) {
				let savePassword = result.value;
				// let password = prompt();
					// let wallet = WalletRepository.getMain();
					let wallet = WalletRepository.getLocalWalletWithPassword(savePassword);
					if(wallet !== null) {
						swal({
							title: 'Private keys',
							html: 'Please store carefully those keys. <b>Possessing them means possessing the funds associated</b> !<br/>'+
'Spend key: '+wallet.keys.priv.spend+'<br/>'+
'Private key: '+wallet.keys.priv.view,
						});
					}else{
						swal({
							type: 'error',
							title: 'Oops...',
							text: 'Your password seems invalid',
						});
					}
			}
		});
	}

	getMnemonicPhrase(){
		swal({
			title: 'Wallet password',
			input: 'password',
			showCancelButton: true,
			confirmButtonText: 'Export',
		}).then((passwordResult:any) => {
			if (passwordResult.value) {
				swal({
					title: 'In which lang do you want your mnemonic phrase ?',
					input: 'select',
					showCancelButton: true,
					confirmButtonText: 'Export',
					inputOptions:{
						'english':'English',
						'chinese':'Chinese (simplified)',
						'dutch':'Dutch',
						'electrum':'Electrum',
						'esperanto':'Esperanto',
						'french':'French',
						'italian':'Italian',
						'japanese':'Japanese',
						'lojban':'Lojban',
						'portuguese':'Portuguese',
						'russian':'Russian',
						'spanish':'Spanish',
					}
				}).then((mnemonicLangResult:any) => {
					let savePassword = passwordResult.value;
					// let password = prompt();
					// let wallet = WalletRepository.getMain();
					let wallet = WalletRepository.getLocalWalletWithPassword(savePassword);
					if (wallet !== null) {
						let mnemonic = Mnemonic.mn_encode(wallet.keys.priv.spend, mnemonicLangResult.value);

						swal({
							title: 'Private keys',
							html: 'Please store carefully this mnemonic phrase. <b>Possessing it means possessing the funds associated</b> ! The phrase in the '+mnemonicLangResult.value+' dictionary is:<br/>' +
							mnemonic
						});
					} else {
						swal({
							type: 'error',
							title: 'Oops...',
							text: 'Your password seems invalid',
						});
					}
				});
			}
		});
	}

	fileExport(){
		swal({
			title: 'Wallet password',
			input: 'password',
			showCancelButton: true,
			confirmButtonText: 'Export',
		}).then((result:any) => {
			if (result.value) {
				let savePassword = result.value;
				// let password = prompt();
				// let wallet = WalletRepository.getMain();
				let wallet = WalletRepository.getLocalWalletWithPassword(savePassword);
				if(wallet !== null) {
					let exported = WalletRepository.getEncrypted(wallet, savePassword);
					let blob = new Blob([JSON.stringify(exported)], {type: "application/json"});
					saveAs(blob, "wallet.json");
				}else{
					swal({
						type: 'error',
						title: 'Oops...',
						text: 'Your password seems invalid',
					});
				}
			}
		});
	}

	exportEncryptedPdf(){
		let self = this;
		swal({
			title: 'Wallet password',
			input: 'password',
			showCancelButton: true,
			confirmButtonText: 'Export',
		}).then((result:any) => {
			if (result.value) {
				let savePassword = result.value;
				// let password = prompt();
				// let wallet = WalletRepository.getMain();
				let wallet = WalletRepository.getLocalWalletWithPassword(savePassword);
				if(wallet !== null) {
					WalletRepository.downloadEncryptedPdf(wallet);
				}else{
					swal({
						type: 'error',
						title: 'Oops...',
						text: 'Your password seems invalid',
					});
				}
			}
		});
	}

}

if(wallet !== null && blockchainExplorer !== null)
	new ExportView('#app');
else
	window.location.href = '#index';