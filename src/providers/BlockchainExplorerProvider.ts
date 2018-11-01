

import {Constants} from "../model/Constants";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {BlockchainExplorerRpc2} from "../model/blockchain/BlockchainExplorerRpc2";

export class BlockchainExplorerProvider{

	static getInstance() : BlockchainExplorerRpc2{
		let blockchainExplorer : BlockchainExplorerRpc2 = DependencyInjectorInstance().getInstance(Constants.BLOCKCHAIN_EXPLORER);
		if(blockchainExplorer === null) {
			blockchainExplorer = new BlockchainExplorerRpc2();
			DependencyInjectorInstance().register(Constants.BLOCKCHAIN_EXPLORER, blockchainExplorer);
		}
		return blockchainExplorer;
	}

}