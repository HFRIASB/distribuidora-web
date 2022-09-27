import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap'; import { Estado } from 'src/app/models/enums/estado';
import { EstadoPedido } from 'src/app/models/enums/estado-pedido';
import { Orden } from 'src/app/models/orden';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  estados: any = Object.keys(EstadoPedido)
  administrador: Usuario = new Usuario();
  searchTextCliente: string = '';
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  pedidosTodos: Orden[] = []
  pedidos: Orden[] = [];
  clientes: Usuario[] = [];
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
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
    });
    this.authService.getOnlyClientes()
      .subscribe((data: any) => {
        this.clientes = data;
      })
  }

  ngOnInit(): void {
    this.productoService.getPedidos()
      .subscribe(
        (data: Orden[]) => {
          this.pedidosTodos = data
          this.mapFecha();
        }
      )
  }

  mapFecha() { //cambiar por map
    this.pedidosTodos.forEach((p: Orden) => {
      p.fVenta_ord = new Date(p.fVenta_ord)
      p.fEntrega_ord = new Date(p.fEntrega_ord)
    })
    this.pedidos = this.pedidosTodos;
  }

  changeRadioEstado(event: any) {
    this.filtros.estado = event.value.toString()
    if (this.filtros.cliente.id_usu == undefined && this.fechaInicio == undefined && this.fechaFin == undefined) {
      if (this.filtros.estado == 'Todos')
        this.pedidos = this.pedidosTodos.filter((obj) => {
          return obj.estado_ord === this.filtros.estado;
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

  getFechaFormat(fecha: Date) {
    let day = '';
    if (fecha.getDay() == 0)
      day = 'Domingo'
    else if (fecha.getDay() == 1)
      day = 'Lunes'
    else if (fecha.getDay() == 2)
      day = 'Martes'
    else if (fecha.getDay() == 3)
      day = 'Miercoles'
    else if (fecha.getDay() == 4)
      day = 'Jueves'
    else if (fecha.getDay() == 5)
      day = 'Viernes'
    else if (fecha.getDay() == 6)
      day = 'Sabado'
    return day + ', ' + fecha.getDate() + '/' + (fecha.getMonth() + 1).toString() + '/' + fecha.getFullYear();
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

  quitarFiltros(){
    location.reload()
  }

  quitarFiltroCliente() {
    this.pedidos = this.pedidosTodos;
    this.filtros.cliente = new Usuario()
  }

  goNuevoPedido() {
    this.router.navigate(['admin', this.administrador.id_usu, 'nuevo-pedido'], { replaceUrl: true });
  }

  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goAlmacen() {
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }

  goVistaPedido(pedido: Orden) {
    this.router.navigate(['admin', this.administrador.id_usu, 'detalle-pedido', pedido.id_ord], { replaceUrl: true });
  }

  goVarios(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }
}
