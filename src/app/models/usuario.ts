import { Direccion } from "./direccion";
import { Pago } from "./pago";
import { Rol } from "./rol";

export class Usuario {
    id_usu?: number;

    nombre_usu?: string;

    nroDocu_usu?: string;

    sexo_usu?: string;

    celular_usu?: string;

    fRegistro_usu?: Date;

    estado_usu?: string;

    usuario_usu?: string;

    correo_usu?: string;

    password_usu?: string;

    observacion_usu?: string;

    deuda_usu?: number;

    rol?: Rol;

    direccion?: Direccion[];

    // orden: Orden[];

    // controlEnvase: ControlEnvase[];

    pago?: Pago[];

}
