


export class MathUtil{

	static randomFloat(){
		const randomBuffer = new Uint32Array(1);
		window.crypto.getRandomValues(randomBuffer);
		return randomBuffer[0] / (0xffffffff + 1);
	}

	static randomUint32(){
		const randomBuffer = new Uint32Array(1);
		window.crypto.getRandomValues(randomBuffer);
		return randomBuffer[0];
	}

	static getRandomInt(min : number, max : number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static randomTriangularSimplified(max : number){
		let r = MathUtil.randomUint32() % (1 << 53);
		let frac = Math.sqrt(r / (1 << 53));
		let i = (frac*max)|0;
		// just in case rounding up to 1 occurs after sqrt
		if (i == max)
			--i;
		return i;
	}

}