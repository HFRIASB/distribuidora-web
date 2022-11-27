import { TipoEnvase } from "./tipo-envase";
import { Usuario } from "./usuario";

export class ControlEnvase {
    id_ce?: number;

    garantia_ce?: number;

    cantEnvase_ce?: number;
    
    motivo_ce?: string;

    fecha_ce?: Date;

    usuario?: Usuario;

    tipoEnvase: any;

    constructor(){
        
    }
}
