import { Usuario } from "./usuario";

export class Rol {
    id_rol?: number;

    nombre_rol?: string;

    fRegistro_rol?: Date;

    estado_rol?: string;

    usuario?: Usuario[];
}
