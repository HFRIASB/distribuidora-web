import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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

  getUsuarioDireccion(id_user: number) {
    return this.http.get(`${this.api_url}usuario/direccion/${id_user}`);
  }

  registrarUsuario(usuario: any) {
    return this.http.post(this.api_url + 'usuario', usuario);
  }

  getUsuarioOrden(id_user: number, estado: string) {
    return this.http.get(`${this.api_url}usuario/orden/${id_user}/${estado}`);
  }

  getUsuarioById(id: string) {
    return this.http.get(this.api_url + 'usuario/' + id);
  }

  getOnlyClientes() {
    return this.http.get(this.api_url + 'usuario/onlyClientes');
  }

  getDetalleCliente(cliente: number) {
    return this.http.get(this.api_url + "usuario/detalle-cliente/" + cliente.toString());
  }
}
