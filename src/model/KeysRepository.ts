

export type UserKeys = {
	pub:{
		view:string,
		spend:string,
	},
	priv:{
		spend:string,
		view:string
	}
}

export class KeysRepository{

	static get() : UserKeys|null{
		return null;
		// let raw = window.localStorage.getItem('userKeys');
		// if(raw === null)return null;
		// return JSON.parse(raw);
	}

	static fromPriv(spend : string, view : string) : UserKeys{
		let pubView = cnUtil.sec_key_to_pub(view);
		let pubSpend = cnUtil.sec_key_to_pub(spend);
		return {
			pub:{
				view:pubView,
				spend:pubSpend
			},
			priv:{
				view:view,
				spend:spend,
			}
		}
	}

	static save(keys : UserKeys){
		window.localStorage.setItem('userKeys', JSON.stringify(keys));
	}

}