import { Producto } from "./producto";

export class ControlFisicoProducto {
	id_cfp: number;
	fecha_cfp: Date;
	detalle_cfp: string;
	entrada_cfp: number;
	salida_cfp: number;
	saldo_cfp: number;
	producto: Producto;

	constructor() {
		this.id_cfp = 0;
		this.fecha_cfp= new Date();
		this.detalle_cfp = '';
		this.entrada_cfp = 0;
		this.salida_cfp = 0 ;
		this.saldo_cfp = 0;
		this.producto = new Producto();
	}
}
