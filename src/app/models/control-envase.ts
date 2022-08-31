import { Usuario } from "./usuario";

export class ControlEnvase {
    id_ce?: number;

    estado_ce?: string;

    tipEnvase_ce?: string;

    garantia_ce?: number;

    cantEnvase_ce?: number;
    
    motivo_ce?: string;

    fecha_ce?: Date;

    usuario?: Usuario;
}
