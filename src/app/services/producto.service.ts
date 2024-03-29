import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { ignoreElements, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IngresoProducto } from '../models/ingreso';
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
    // let id_drive=data.foto_prod?.split('/');
    // data.foto_prod=`https://drive.google.com/uc?id=${id_drive[5]}`
    return this.http.patch(`${this.api_url}producto/${data.id_prod}`, data)
  }
  patchProductosVendedor(data: any) {
    return this.http.patch(`${this.api_url}producto/${data.id_prod}`, data)
  }

  postProducto(data: any) {
    if (!data.foto_prod) {
      data.foto_prod = "";//imagen que vamos a crear
    }
    let id_drive=data.foto_prod.split('/')
    id_drive[5]
    let payload = {
      nombre_prod: data.nombre_prod,
      foto_prod:`https://drive.google.com/uc?id=${id_drive[5]}`,
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
    return this.http.get<TipoEnvase[]>(`${this.api_url}tipo-envase`);
  }
  postEnvase(data:any) {
    console.log(data,"esto recibe el service")
    let payload={
      precio_envase: data.precio,
      nombre_envase: data.nombre
    }
    return this.http.post(`${this.api_url}tipo-envase`,payload)
  }

  updateEnvase(data: TipoEnvase) {
    return this.http.patch(`${this.api_url}tipo-envase/${data.id_envase}`,
      {
        precio_envase:data.precio_envase,
        nombre_envase: data.nombre_envase
      })
  }

  getIngreso() {
    return this.http.get(`${this.api_url}ingreso-producto`)
  }

  postIngreso(ingreso: IngresoProducto) {
    let payload = {
      chofer_ingreso_producto: ingreso.chofer_ingreso_producto,
      fecha_ingreso_producto: ingreso.fecha_ingreso_producto,
      cantidad_ingreso_producto: ingreso.cantidad_ingreso_producto,
      producto: ingreso.producto.id_prod
    }
    return this.http.post(`${this.api_url}ingreso-producto`, payload);
  }

  patchStockProducto(id: any, cantidad: any) {
    return this.http.patch(this.api_url + 'producto/' + id + '/cantidad/' + cantidad, null)
  }

  // patchIngreso(ingreso: IngresoProducto) {
  //   let payload = {
  //     chofer_ingreso_producto: ingreso.chofer_ingreso_producto,
  //     fecha_ingreso_producto: ingreso.fecha_ingreso_producto,
  //     // cantidad_ingreso: ingreso.cantidad_ingreso_producto
  //   }
  //   return this.http.patch(this.api_url + 'ingreso/' + ingreso.id_ingreso_producto, payload);
  // }

  deleteIngreso(id: number){
    return this.http.delete(this.api_url+'ingreso-producto/'+id)
  }

  postPedido(pedido: any) {
    return this.http.post(`${this.api_url}orden`, pedido)
  }

  getPedidoId(id: string): Observable<Orden> {
    return this.http.get<Orden>(`${this.api_url}orden/${id}`)
  }
  getPedidosByClient(){
    return this.http.get<any>(`${this.api_url}orden/client`)
  }
  getPedidosByClientAndDate(dateInicio:Date,dateFin:Date){
    return this.http.get<any>(`${this.api_url}orden/filterDate?fechaInicio=${dateInicio.toISOString()}&fechaFin=${dateFin.toISOString()}`)
  }
  getPedidosByVendor(){
    return this.http.get<any>(`${this.api_url}cartera-cliente/vendedor`)
  }
  getPedidosByVendorAndDate(dateInicio:Date,dateFin:Date){
    return this.http.get<any>(`${this.api_url}cartera-cliente/filterDate?fechaInicio=${dateInicio.toISOString()}&fechaFin=${dateFin.toISOString()}`)
  }

  postDetallePedido(carrito: any, id_ord: number) {
    let payload = {
      cantidad_op: carrito.cantidad_producto,
      producto: carrito.producto.id_prod,
      orden: id_ord,
      precioUni_op: carrito.precio
    }
    return this.http.post(`${this.api_url}orden-producto`, payload)
  }

  getPedidoProductos(idOrden: string) {
    return this.http.get(`${this.api_url}orden-producto/byOrden/${idOrden}`)
  }

  patchPedidoProducto(producto: OrdenProducto) {
    let payload = {
      cantidad_op: producto.cantidad_op,
      precioUni_op: producto.precioUni_op
    }
    return this.http.patch(`${this.api_url}orden-producto/${producto.id_op}`, payload)
  }
  patchPedidoVendedor(pedido: any) {
     let payload ={
      direccion:pedido.direccion.id_direc,
      fEntrega_ord:pedido.fEntrega_ord,
      fVenta_ord:pedido.fVenta_ord,
     }
    return this.http.patch(`${this.api_url}orden/${pedido.id_ord}`, payload)
  }
  patchPedidoAdmin(pedido: any) {
    let id_drive=pedido.url_ord.split('/')
    let payload
    if(id_drive[5]!=undefined){
       payload ={
        direccion:pedido.direccion.id_direc,
        fEntrega_ord:pedido.fEntrega_ord,
        fVenta_ord:pedido.fVenta_ord,
        numNota_ord:pedido.numNota_ord,
        url_ord:`https://drive.google.com/uc?id=${id_drive[5]}`
       
       }
    }
     else{
       payload ={
        direccion:pedido.direccion.id_direc,
        fEntrega_ord:pedido.fEntrega_ord,
        fVenta_ord:pedido.fVenta_ord,
        numNota_ord:pedido.numNota_ord,
        url_ord:pedido.url_ord
       }
     }
    return this.http.patch(`${this.api_url}orden/${pedido.id_ord}`, payload)
  }

  patchPedido(pedido: any) {
     let payload ={
      estado_ord:pedido.estado_ord
     }
    return this.http.patch(`${this.api_url}orden/${pedido.id_ord}`, payload)
  }

  getProductoVendidoPorYear(id_prod: string, semana: string, year: string) {
    return this.http.get(`${this.api_url}orden-producto/producto-year/${id_prod}/${year}/${semana}`)
  }

  getProductoVendidoPorYearMonth(id_prod: string, year: string) {
    return this.http.get(`${this.api_url}orden-producto/producto-year-month/${id_prod}/${year}`)
  }

  postControlProducto(control: ControlFisicoProducto) {
    let payload = {
      fecha_cfp: control.fecha_cfp,
      detalle_cfp: control.detalle_cfp,
      entrada_cfp: control.entrada_cfp,
      salida_cfp: control.salida_cfp,
      producto: control.producto.id_prod
    }
    return this.http.post(`${this.api_url}control-fisico-producto`, payload)
  }

  patchControlProducto(control: any){
    let payload = {
      detalle_cfp: control.detalle_cfp,
      entrada_cfp: control.entrada_cfp,
      salida_cfp: control.salida_cfp
    }
    return this.http.patch(`${this.api_url}control-fisico-producto/${control.id_cfp}`, payload)
  }

  getControlProducto(month: number, year: string, idProducto: number) {
    return this.http.get(`${this.api_url}control-fisico-producto/producto/${idProducto}/month/${month}/year/${year}`)
  }

  postControlFisicoEnvase(control: ControlFisicoEnvase) {
    let payload = {
      fecha_cfe: control.fecha_cfe,
      detalle_cfe: control.detalle_cfe,
      entrada_cfe: control.entrada_cfe,
      salida_cfe: control.salida_cfe,
      tipo_envase: control.envase.id_envase
    }
    return this.http.post(`${this.api_url}control-fisico-envase`, payload)
  }

  patchControlFisicoEnvase(control: any){
    let payload ={
      detalle_cfe: control.detalle_cfe,
      entrada_cfe: control.entrada_cfe,
      salida_cfe: control.salida_cfe
    }
    return this.http.patch(`${this.api_url}control-fisico-envase/${control.id_cfe}`, payload)
  }

  getControlFisicoEnvase(month: number, year: string, id_envase: number) {
    return this.http.get(`${this.api_url}control-fisico-envase/envase/${id_envase}/month/${month}/year/${year}`)
  }

  getOrdenesByVendedor(id: number) {
    return this.http.get(`${this.api_url}orden/vendedor/${id}`);
  }

  postControlEnvase(payload: any){
    return this.http.post(this.api_url+"control-envase", payload);
  }

  deleteControlEnvase(id: any){
    return this.http.delete(this.api_url+"control-envase/" + id);
  }

  getFechaFormat(fecha: string) {
    let newFecha = new Date(fecha);
    let day = this.getDay(newFecha.getDay())
    let date = newFecha.getDate();
    let month = this.getMonth(newFecha.getMonth())
    return day + ', ' + date + ' de ' + month + ' del '+ newFecha.getFullYear();
  }

  getDay(day: number): string {
    switch (day) {
      case 0: {
        return 'Domingo';
      }
      case 1: {
        return 'Lunes';
      }
      case 2: {
        return 'Martes';
      }
      case 3: {
        return 'Miercoles';
      }
      case 4: {
        return 'Jueves';
      }
      case 5: {
        return 'Viernes';
      }
      default: {
        return 'Sabado'
      }
    }
  }

  getMonth(month: number): string {
    switch (month) {
      case 0: {
        return 'Enero';
      }
      case 1: {
        return 'Febrero';
      }
      case 2: {
        return 'Marzo';
      }
      case 3: {
        return 'Abril';
      }
      case 4: {
        return 'Mayo';
      }
      case 5: {
        return 'Junio';
      }
      case 6: {
        return 'Julio';
      }
      case 7: {
        return 'Agosto';
      }
      case 8: {
        return 'Septiembre';
      }
      case 9: {
        return 'Octubre';
      }
      case 10: {
        return 'Noviembre';
      }
      default: {
        return 'Diciembre'
      }
    }
  }
}
