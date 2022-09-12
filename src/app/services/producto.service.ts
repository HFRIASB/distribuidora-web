import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TipoEnvase } from '../models/tipo-envase';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  api_url = environment.api_url
  constructor(private http: HttpClient) { }

  getProductos(): Observable<any> {
    return this.http.get(`${this.api_url}producto`);
  }

  patchProductos(data: any) {
    return this.http.patch(`${this.api_url}producto/${data.id_prod}`, data)
  }

  postProducto(data: any) {
    console.log(data)
    if (!data.foto_prod) {
      data.foto_prod = "";//imagen que vamos a crear
    }
    let payload = {
      nombre_prod: data.nombre_prod,
      foto_prod: data.foto_prod,
      stock_prod: data.stock_prod,
      precioCompra_prod: data.precioCompra_prod,
      estado_prod: data.estado_prod,
      uniMedida_prod: data.uniMedida_prod
    }
    return this.http.post(`${this.api_url}producto`, payload)
  }

  getPedidos() {
    return this.http.get(`${this.api_url}orden`)
  }

  getEnvases() {
    return this.http.get(`${this.api_url}tipo-envase`);
  }
  postEnvase(data: string) {
    return this.http.post(`${this.api_url}tipo-envase`,
    {
      nombre_envase: data
    })
  }

  updateEnvase(data: TipoEnvase) {
    return this.http.patch(`${this.api_url}tipo-envase/${data.id_envase}`,
    {
      nombre_envase: data.nombre_envase
    })
  }
}
