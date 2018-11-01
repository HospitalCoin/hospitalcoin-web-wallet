

export class CoinUri{

	static coinTxPrefix = 'hospitalcoin:';
	static coinWalletPrefix = 'hospitalcoin:';
	static coinAddressLength = 95;

	static decodeTx(str : string) : {
		address:string,
		paymentId?:string,
		recipientName?:string,
		amount?:string,
		description?:string,
	}|null {
		if(str.indexOf(CoinUri.coinTxPrefix) === 0){
			let data = str.replace(this.coinTxPrefix,'').trim();
			let exploded = data.split('?');

			if(exploded.length == 0)
				throw 'missing_address';

			if(exploded[0].length !== this.coinAddressLength)
				throw 'invalid_address_length';

			let decodedUri : any = {
				address:exploded[0]
			};

			for(let i = 1; i < exploded.length; ++i){
				let optionParts = exploded[i].split('=');
				if(optionParts.length === 2){
					switch (optionParts[0].trim()){
						case 'tx_payment_id':
							decodedUri.paymentId=optionParts[1];
							break;
						case 'recipient_name':
							decodedUri.recipientName=optionParts[1];
							break;
						case 'tx_amount':
							decodedUri.amount=optionParts[1];
							break;
						case 'tx_description':
							decodedUri.description=optionParts[1];
							break;
					}
				}
			}
			return decodedUri;
		}
		throw 'missing_prefix';
	}

	static isTxValid(str : string){
		try{
			this.decodeTx(str);
			return true;
		}catch (e) {
			return false;
		}
	}

	static encodeTx(address : string, paymentId:string|null = null, amount : string|null=null, recipientName:string|null = null, description : string|null=null) : string{
		let encoded = this.coinTxPrefix + address;
		if(address.length !== this.coinAddressLength)
			throw 'invalid_address_length';

		if(paymentId !== null) encoded += '?tx_payment_id='+paymentId;
		if(amount !== null) encoded+= '?tx_amount='+amount;
		if(recipientName !== null) encoded += '?recipient_name='+recipientName;
		if(description !== null) encoded += '?tx_description='+description;
		return encoded;
	}

	static decodeWallet(str : string) : {
		address:string,
		spendKey?:string,
		viewKey?:string,
		mnemonicSeed?:string,
		height?:string,
		nonce?:string,
		encryptMethod?:string
	}{
		if(str.indexOf(CoinUri.coinWalletPrefix) === 0){
			let data = str.replace(this.coinWalletPrefix,'').trim();
			let exploded = data.split('?');

			if(exploded.length == 0)
				throw 'missing_address';

			if(exploded[0].length !== this.coinAddressLength)
				throw 'invalid_address_length';

			let decodedUri : any = {
				address:exploded[0]
			};

			for(let i = 1; i < exploded.length; ++i){
				let optionParts = exploded[i].split('=');
				if(optionParts.length === 2){
					switch (optionParts[0].trim()){
						case 'spend_key':
							decodedUri.spendKey=optionParts[1];
							break;
						case 'view_key':
							decodedUri.viewKey=optionParts[1];
							break;
						case 'mnemonic_seed':
							decodedUri.mnemonicSeed=optionParts[1];
							break;
						case 'height':
							decodedUri.height=optionParts[1];
							break;
						case 'nonce':
							decodedUri.nonce=optionParts[1];
							break;
						case 'encrypt_method':
							decodedUri.encryptMethod=optionParts[1];
							break;
					}
				}
			}

			if(
				typeof decodedUri.mnemonicSeed !== 'undefined' ||
				typeof decodedUri.spendKey !== 'undefined' ||
				(typeof decodedUri.viewKey !== 'undefined' && typeof decodedUri.address !== 'undefined')
			) {
				return decodedUri;
			}else
				throw 'missing_seeds';
		}
		throw 'missing_prefix';
	}

	static isWalletValid(str : string){
		try{
			this.decodeWallet(str);
			return true;
		}catch (e) {
			return false;
		}
	}

	static encodeWalletKeys(address : string, spendKey : string, viewKey : string|null=null, height:number|null=null, encryptMethod:string|null=null,nonce:string|null=null){
		let encoded = this.coinWalletPrefix + address;
		if(address.length !== this.coinAddressLength)
			throw 'invalid_address_length';

		if(spendKey !== null) encoded += '?spend_key='+spendKey;
		if(viewKey !== null) encoded+= '?view_key='+viewKey;
		if(height !== null) encoded += '?height='+height;
		if(nonce !== null) encoded += '?nonce='+nonce;
		if(encryptMethod !== null) encoded += '?encrypt_method='+encryptMethod;
		return encoded;
	}



}