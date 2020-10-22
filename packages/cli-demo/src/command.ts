import { EventEmitter } from "events";

export
class Command extends EventEmitter{
	alias: CustomTS
	store: CustomTS

	constructor(){
		super()
		this.alias = {}
		this.store = {}
	}

	get(name:string){
		return this.alias[name]
	}

	list(){}

	register(name:string, value: Function){
		return this.alias[name] = value
	}
}