import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlEnvase } from 'src/app/models/control-envase';
import { EstadoPedido } from 'src/app/models/enums/estado-pedido';
import { Orden } from 'src/app/models/orden';
import { OrdenProducto } from 'src/app/models/orden-producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css'],
})
export class PedidosComponent implements OnInit {
  searchText = '';
  EstadoPedido = EstadoPedido;
  clientes: Usuario[] = [];
  pedidoSeleccionado: Orden = new Orden();
  cliente: Usuario = new Usuario();
  vendedor: Usuario = new Usuario();
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  pedidos: any[] = [];
  pedidosTodos: Orden[] = []
  pedidosFiltrados: any[] = [];
  estados: any = Object.keys(EstadoPedido)
  filtros = {
    cliente: new Usuario(),
    estado: 'Todos'
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.estados.unshift('Todos')
    this.filtros.estado = this.estados.Todos
    this.route.params.subscribe((params) => {
      this.authService.getUsuarioById(params['id']).subscribe((user: any) => {
        this.vendedor = user;
      });
      this.productoService
        .getOrdenesByVendedor(+params['id'])
        .subscribe((data: any) => {
          this.pedidosTodos = data
          this.mapFecha();
          //this.pedidos = data;
         
        });
      this.authService
        .getCarteraClientes(params['id'])
        .subscribe((clientes: any) => {
          console.log(clientes,"esto devuelve en vendedor")
          this.clientes = clientes;
        });
    });
  }
  mapFecha() { //cambiar por map
    this.pedidosTodos.forEach((p: Orden) => {
      p.fVenta_ord = new Date(p.fVenta_ord)
      p.fEntrega_ord = new Date(p.fEntrega_ord)
    })
    this.pedidos = this.pedidosTodos;
    this.pedidosFiltrados = this.pedidos;
  }

  ngOnInit(): void { }

  seleccionarCliente(cliente: Usuario) {
    this.filtros.cliente = cliente;
    if (this.filtros.estado == this.estados.Todos) {
      if (this.fechaInicio && this.fechaFin) {
        let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
        let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
        fin.setHours(23, 59, 59)
        if (inicio.getTime() <= fin.getTime()) {
          this.pedidos = this.pedidosTodos.filter((obj) => {
            return obj.usuario?.id_usu === cliente.id_usu
              && obj.fEntrega_ord.getTime() >= inicio.getTime() &&
              obj.fEntrega_ord.getTime() <= fin.getTime();
          })
        } else {
          console.log('la fecha de inicio tiene que ser antes que la fecha de final')
        }
      } else {
        this.pedidos = this.pedidosTodos.filter((obj) => {
          return obj.usuario?.id_usu === cliente.id_usu;
        })
      }
    } else {
      if (this.fechaInicio && this.fechaFin) {
        let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
        let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
        fin.setHours(23, 59, 59)
        if (inicio.getTime() <= fin.getTime()) {
          this.pedidos = this.pedidosTodos.filter((obj) => {
            return obj.usuario?.id_usu === cliente.id_usu
              && obj.estado_ord === this.filtros.estado
              && obj.fEntrega_ord.getTime() >= inicio.getTime() &&
              obj.fEntrega_ord.getTime() <= fin.getTime();
          })
        } else {
          console.log('la fecha de inicio tiene que ser antes que la fecha de final')
        }
      } else {
        this.pedidos = this.pedidosTodos.filter((obj) => {
          return obj.usuario?.id_usu === cliente.id_usu
            && obj.estado_ord === this.filtros.estado;
        })
      }
    }
  }
  filtrarPorFecha() {
    if (this.fechaInicio && this.fechaFin) {
      let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
      let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
      fin.setHours(23, 59, 59)
      if (inicio.getTime() <= fin.getTime()) {
        this.pedidos = this.pedidosTodos.filter((obj) => {
          return obj.fEntrega_ord.getTime() >= inicio.getTime() &&
            obj.fEntrega_ord.getTime() <= fin.getTime();
        })
      } else {
        console.log('la fecha de inicio tiene que ser antes que la fecha de final')
      }
    } else {
      console.log('alert ingrese los rangos de fecha')
    }
  }
  
  changeRadioEstado(event: any) {
    this.filtros.estado = event.value.toString()
    if (this.filtros.cliente.id_usu == undefined && this.fechaInicio == undefined && this.fechaFin == undefined) {
      if (this.filtros.estado == 'Todos')
        this.pedidos = this.pedidosTodos.filter((obj) => {
          //return obj.estado_ord === this.filtros.estado;
          return true;
        })
      else {
        this.pedidos = this.pedidosTodos.filter((obj) => {
          return obj.estado_ord === this.filtros.estado;
        })
      }
    } else {
      if (this.filtros.cliente.id_usu && this.fechaInicio == undefined && this.fechaFin == undefined) {
        if (this.filtros.estado == 'Todos')
          this.pedidos = this.pedidosTodos.filter((obj) => {
            return obj.usuario?.id_usu === this.filtros.cliente.id_usu;
          })
        else {
          this.pedidos = this.pedidosTodos.filter((obj) => {
            return obj.usuario?.id_usu === this.filtros.cliente.id_usu
              && obj.estado_ord === this.filtros.estado;
          })
        }
      } else {
        if (this.fechaInicio && this.fechaFin) {
          let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
          let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
          fin.setHours(23, 59, 59)
          if (inicio.getTime() <= fin.getTime()) {
            if (this.filtros.estado == 'Todos')
              this.pedidos = this.pedidosTodos.filter((obj) => {
                return obj.usuario?.id_usu === this.filtros.cliente.id_usu
                  && obj.fEntrega_ord.getTime() >= inicio.getTime() &&
                  obj.fEntrega_ord.getTime() <= fin.getTime();
              })
            else {
              this.pedidos = this.pedidosTodos.filter((obj) => {
                return obj.usuario?.id_usu === this.filtros.cliente.id_usu
                  && obj.estado_ord === this.filtros.estado
                  && obj.fEntrega_ord.getTime() >= inicio.getTime()
                  && obj.fEntrega_ord.getTime() <= fin.getTime();
              })
            }
          } else {
            console.log('la fecha de inicio tiene que ser antes que la fecha de final')
          }
        } else {
          console.log('alert ingrese los rangos de fecha')
        }
      }
    }
  }
  quitarFiltroCliente() {
    this.pedidos = this.pedidosTodos;
    this.filtros.cliente = new Usuario()
  }

  aplicarFiltros() {
    if (
      this.cliente.id_usu != undefined
      && this.fechaInicio != undefined
      && this.fechaFin != undefined
    ) {
      let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day);
      let final = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day, 23, 59, 59);
      this.pedidosFiltrados = this.pedidos.filter((item: any) => {
        return (new Date(item.fEntrega_ord)).getTime() >= inicio.getTime() &&
          (new Date(item.fEntrega_ord)).getTime() <= final.getTime() &&
          item.usuario.id_usu == this.cliente.id_usu
      })

    }
  }
  selectPedido(pedido: Orden) {
    this.pedidoSeleccionado = pedido;
  }

  cambiarEntregado() {
    this.changeEstado(this.pedidoSeleccionado);
    location.reload();
  }
  async changeEstado(pedido: Orden) {
    if (pedido.estado_ord == EstadoPedido.Pendiente) {
      let payload = {
        id_ord: pedido.id_ord,
        estado_ord: EstadoPedido.Entregado
      }
      this.productoService.patchPedido(payload)
        .subscribe(data => {
          pedido.ordenProducto.forEach((op: OrdenProducto, index) => {
            this.productoService.patchStockProducto(op.producto?.id_prod, -op.cantidad_op)
              .subscribe(op => {
                if (pedido.ordenProducto.length - 1 == index) {
                  location.reload();
                }
              })
          })
        })
    } else if (pedido.estado_ord == EstadoPedido.Entregado) {
      let payload = {
        id_ord: pedido.id_ord,
        estado_ord: EstadoPedido.Pendiente
      }
      if (pedido.controlEnvase.length > 0) {
        await pedido.controlEnvase.forEach((ce: ControlEnvase)=>{
          this.productoService.deleteControlEnvase(ce.id_ce)
          .subscribe(()=>{
          })
        })
      }
      this.productoService.patchPedido(payload)
        .subscribe(data => {
          pedido.ordenProducto.forEach((op: OrdenProducto, index) => {
            this.productoService.patchStockProducto(op.producto?.id_prod, op.cantidad_op)
              .subscribe(op => {
                if (pedido.ordenProducto.length - 1 == index) {
                  location.reload();
                }
              })
          })
        })
    }
  }

  quitarFiltros() {
    window.location.reload()
  }

  getFechaFormato(fecha: string) {
    let fechaFormato = new Date(fecha);
    return fechaFormato.getDate() + '/' + (fechaFormato.getMonth() + 1) + '/' + fechaFormato.getFullYear();
  }

  goReportes() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'reportes'], {
      replaceUrl: true,
    });
  }

  goUsuarios() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'usuarios'], {
      replaceUrl: true,
    });
  }

  goNuevoPedido() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'nuevo-pedido'], {
      replaceUrl: true,
    });
  }

  goDetallePedido(id: number) {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedido-detalle', id], {
      replaceUrl: true,
    });
  }

  goLogin(){
    this.router.navigate([''], {
      replaceUrl: true,
    });
  }
}
