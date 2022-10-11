import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Almacen } from '../models/almacen';
import { ControlFisicoEnvase } from '../models/control-fisico-envase';
import { ControlFisicoProducto } from '../models/control-fisico-producto';
import { Orden } from '../models/orden';
import { OrdenProducto } from '../models/orden-producto';
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
    return this.http.get<Orden[]>(`${this.api_url}orden`)
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

  getAlmacen() {
    return this.http.get(`${this.api_url}almacen`)
  }

  postAlmacen(almacen: Almacen){
    let payload = {
      chofer_almacen: almacen.chofer_almacen,
      fecha_almacen: almacen.fecha_almacen,
      tipo_almacen: almacen.tipo_almacen,
      cantidad_almacen: almacen.cantidad_almacen,
      item_almacen: almacen.item_almacen,
      estado_almacen: almacen.estado_almacen
    }
    return this.http.post(`${this.api_url}almacen`, payload);
  }

  patchAlmacen(almacen: Almacen){
    let payload = {
      chofer_almacen: almacen.chofer_almacen,
      fecha_almacen: almacen.fecha_almacen,
      tipo_almacen: almacen.tipo_almacen,
      cantidad_almacen: almacen.cantidad_almacen,
      item_almacen: almacen.item_almacen,
      estado_almacen: almacen.estado_almacen
    }
    return this.http.patch(this.api_url+'almacen/'+almacen.id_almacen, payload);
  }

  postPedido(pedido: any){
    return this.http.post(`${this.api_url}orden`,pedido)
  }

  getPedidoId(id: string): Observable<Orden>{
    return this.http.get<Orden>(`${this.api_url}orden/${id}`)
  }

  postDetallePedido(carrito: any, id_ord: number){
    let payload = {
      cantidad_op: carrito.cantidad_producto,
      producto: carrito.producto.id_prod,
      orden: id_ord
    }
    return this.http.post(`${this.api_url}orden-producto`,payload)
  }

  getPedidoProductos(idOrden: string){
    return this.http.get(`${this.api_url}orden-producto/byOrden/${idOrden}`)
  }

  patchPedidoProducto(producto: OrdenProducto){
    let payload = {
      cantidad_op: producto.cantidad_op,
      precioUni_op: producto.precioUni_op
    }
    return this.http.patch(`${this.api_url}orden-producto/${producto.id_op}`,payload)
  }

  patchPedido(pedido: Orden) {
    let payload = {

    }
    return this.http.patch(`${this.api_url}orden/${pedido.id_ord}`, pedido)
  }

  getProductoVendidoPorYear(id_prod: string, semana: string, year: string){
    return this.http.get(`${this.api_url}orden-producto/producto-year/${id_prod}/${year}/${semana}`)
  }

  getProductoVendidoPorYearMonth(id_prod: string, year: string){
    return this.http.get(`${this.api_url}orden-producto/producto-year-month/${id_prod}/${year}`)
  }

  postControlProducto(control: ControlFisicoProducto){
    let payload= {
      fecha_cfp: control.fecha_cfp,
      detalle_cfp: control.detalle_cfp,
      entrada_cfp: control.entrada_cfp,
      salida_cfp: control.salida_cfp,
      producto: control.producto.id_prod
    }
    return this.http.post(`${this.api_url}control-fisico-producto`,payload)
  }

  getControlProducto(month: number, year: string, idProducto: number){
    return this.http.get(`${this.api_url}control-fisico-producto/producto/${idProducto}/month/${month}/year/${year}`)
  }

  postControlFisicoEnvase(control: ControlFisicoEnvase){
    let payload= {
      fecha_cfe: control.fecha_cfe,
      detalle_cfe: control.detalle_cfe,
      entrada_cfe: control.entrada_cfe,
      salida_cfe: control.salida_cfe,
      tipo_envase: control.envase.id_envase
    }
    return this.http.post(`${this.api_url}control-fisico-envase`,payload)
  }

  getControlFisicoEnvase(month: number, year: string, id_envase: number){
    return this.http.get(`${this.api_url}control-fisico-envase/envase/${id_envase}/month/${month}/year/${year}`)
  }

  getOrdenesByVendedor(id: number) {
    return this.http.get(`${this.api_url}orden/vendedor/${id}`)
  }
}
