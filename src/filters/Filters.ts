

export function VueFilterDate(value:number) {
	let date = new Date(value*1000);
	let formated = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' '+date.getHours()+'h'+date.getMinutes();
	return formated;
}

export function VueFilterPiconero(value : number){
	return value/1000000000000;
}