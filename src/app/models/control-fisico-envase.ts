import { TipoEnvase } from "./tipo-envase";

export class ControlFisicoEnvase {
	id_cfe: number;
	fecha_cfe: Date;
	detalle_cfe: string;
	entrada_cfe: number;
	salida_cfe: number;
	saldo_cfe: number;
	envase: TipoEnvase;

	constructor() {
		this.id_cfe = 0;
		this.fecha_cfe= new Date();
		this.detalle_cfe = '';
		this.entrada_cfe= 0;
		this.salida_cfe = 0 ;
		this.saldo_cfe = 0;
		this.envase = new TipoEnvase();
	}
}
