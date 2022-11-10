import { Usuario } from "./usuario";

export class Direccion {
    id_direc?: number;

    nombre_direc: string;

    descripcion_direc: string;

    lat_direc?: string;

    lng_direc?: string;

    rubro_direc: string;

    telefono_direc: string;

    usuario: Usuario;

    constructor() {
        this.nombre_direc = '';
        this.descripcion_direc = '';
        this.rubro_direc = '';
        this.telefono_direc = '';
        this.usuario = new Usuario();
    }
    // orden?: Orden[];
}
