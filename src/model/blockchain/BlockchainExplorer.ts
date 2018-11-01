

import {Wallet} from "../Wallet";

export interface BlockchainExplorer{
	getHeight() : Promise<number>;
	getScannedHeight() : number;
	watchdog(wallet : Wallet) : void;
}