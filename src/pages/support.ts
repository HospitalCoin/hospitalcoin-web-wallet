
import {VueVar, VueWatched} from "../lib/numbersLab/VueAnnotate";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {KeysRepository} from "../model/KeysRepository";
import {Wallet} from "../model/Wallet";
import {Password} from "../model/Password";
import {BlockchainExplorerRpc2} from "../model/blockchain/BlockchainExplorerRpc2";
import {BlockchainExplorerProvider} from "../providers/BlockchainExplorerProvider";
import {Mnemonic} from "../model/Mnemonic";
import {AppState} from "../model/AppState";

let blockchainExplorer : BlockchainExplorerRpc2 = BlockchainExplorerProvider.getInstance();

class SupportView extends DestructableView{
	constructor(container : string){
		super(container);
		let self = this;
		AppState.enableLeftMenu();
	}

}

new SupportView('#app');