import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pago } from '../models/pago';
import { Usuario } from '../models/usuario';
import { Direccion } from '../models/direccion';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api_url = environment.api_url
  constructor(private http: HttpClient) { }


  validarUsuario(datos: any): Observable<any> {
    return this.http.post(this.api_url + 'auth', datos);
  }

  /*getRol(id_user: number) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.api_url}usuario/${id_user}`)
        .subscribe(response => {
          resolve(response)
        }, (error) => {
          reject(error)
        })
    })
  }*/

  getUsuarioDireccion(id_user?: number): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(`${this.api_url}usuario/direccion/${id_user}`);
  }

  registrarUsuario(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.api_url + 'usuario', usuario);
  }

  getUsuarioOrden(id_user: number, estado: string) {
    return this.http.get(`${this.api_url}usuario/orden/${id_user}/${estado}`);
  }

  getUsuarioById(id: string) {
    return this.http.get(this.api_url + 'usuario/detalle-cliente/' + id);
  }

  getOnlyClientes() {
    return this.http.get(this.api_url + 'usuario/onlyClientes');
  }

  getDetalleCliente(cliente: number) {
    return this.http.get(this.api_url + "usuario/detalle-cliente/" + cliente.toString());
  }


  patchUsuario(usuario: Usuario){
    let payload = {
      nombre_usu: usuario.nombre_usu,
      nroDocu_usu: usuario.nroDocu_usu,
      sexo_usu: usuario.sexo_usu,
      celular_usu: usuario.celular_usu,
      observacion_usu: usuario.observacion_usu
    }
    return this.http.patch(this.api_url+'usuario/'+usuario.id_usu, payload)
  }

  getAllDirecciones(): Observable<Direccion[]>{
    return this.http.get<Direccion[]>(this.api_url+'direccion');
  }

  postNuevaDireccion(direccion: Direccion){
    console.log(direccion)
    let payload = {
      nombre_direc: direccion.nombre_direc,
      descripcion_direc: direccion.descripcion_direc,
      lat_direc: direccion.lat_direc,
      lng_direc: direccion.lng_direc,
      rubro_direc: direccion.rubro_direc,
      telefono_direc: direccion.telefono_direc,
      usuario: direccion.usuario?.id_usu
    }
    return this.http.post(this.api_url+'direccion', payload)
  }

  patchDireccion(direccion: Direccion){
    let payload =  {
      nombre_direc: direccion.nombre_direc,
      descripcion_direc: direccion.descripcion_direc,
      lat_direc: direccion.lat_direc,
      lng_direc: direccion.lng_direc,
      rubro_direc: direccion.rubro_direc,
      telefono_direc: direccion.telefono_direc
    }
    return this.http.patch(this.api_url+'direccion/'+direccion.id_direc, payload)
  }

  getUsuariosByRol(rol: string) {
    return this.http.get(this.api_url + "usuario/rol/" + rol);
  }

  getRoles() {
    return this.http.get(this.api_url + "rol/rolesName");
  }

  getCarteraClientes(id?: string){
    return this.http.get(this.api_url + "cartera-cliente/" + id);
  }

  deleteCarteraCliente(id: number) {
    return this.http.delete(this.api_url + "cartera-cliente/" + id)
  }

  realizarPago(data: any) {
    const pago = {
      cantidad_pago: data.monto,
      fecha_pago: new Date(),
      usuario: data.usuario
    }
    return this.http.post(this.api_url+"pago", pago)
  }

  patchPago(data: Pago){
    return this.http.patch(this.api_url+"pago/"+data.id_pago?.toString(), data)
  }

  registrarCarteraCliente(data: any){
    const cartera = {
      id_vendedor: data.id_vendedor,
      usuario: data.id_cliente
    }
    return this.http.post(this.api_url+"cartera-cliente", cartera)
  }

  getRolNameByIdUsuario(id: string) {
     return this.http.get(this.api_url+"usuario/rola-name/" + id);
  }

  getRolByRolName(name: string){
    return this.http.get(this.api_url+"rol/rolName/"+name);
  }

  
}
