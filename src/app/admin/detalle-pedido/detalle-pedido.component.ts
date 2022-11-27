import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlEnvase } from 'src/app/models/control-envase';
import { Direccion } from 'src/app/models/direccion';
import { EstadoPedido } from 'src/app/models/enums/estado-pedido';
import { Orden } from 'src/app/models/orden';
import { OrdenProducto } from 'src/app/models/orden-producto';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {
  estados: any = Object.keys(EstadoPedido)
  administrador: Usuario = new Usuario();
  pedido: Orden = new Orden()
  EstadoPedido = EstadoPedido;
  pedidoAuxiliar: Orden = new Orden();
  ordenProductos: OrdenProducto[] = [];
  direcciones: Direccion[] = [];
  productoSeleccionado: OrdenProducto = new OrdenProducto()
  fechaPedido: NgbDateStruct = this.calendar.getToday();
  fechaEntrega: NgbDateStruct = this.calendar.getToday();
  motivos = [
    'Entrada', 'Salida'
  ];
  tipoEnvase: TipoEnvase[] = [];
  controlEnvase: ControlEnvase = new ControlEnvase();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public productoService: ProductoService,
    private calendar: NgbCalendar,
  ) {
    this.controlEnvase.motivo_ce = 'Entrada';
    this.pedido.usuario = new Usuario();
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
      this.productoService.getPedidoId(params['idPedido'])
        .subscribe((pedido: any) => {
          console.log(pedido)
          this.pedido = pedido;
          this.authService.getUsuarioDireccion(pedido.usuario.id_usu)
            .subscribe((direcciones: any) => {
              this.direcciones = direcciones;
            })
          this.pedidoAuxiliar.id_ord = this.pedido.id_ord;
          this.pedidoAuxiliar.direccion = this.pedido.direccion;
          this.pedidoAuxiliar.estado_ord = this.pedido.estado_ord;
          this.pedidoAuxiliar.numNota_ord = this.pedido.numNota_ord;
          this.pedidoAuxiliar.url_ord = this.pedido.url_ord;
          let date = new Date(this.pedido.fVenta_ord)
          this.fechaPedido = { day: date.getDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
          let date2 = new Date(this.pedido.fEntrega_ord)
          this.fechaEntrega = { day: date2.getDate(), month: date2.getUTCMonth() + 1, year: date2.getUTCFullYear() };
        })
      this.productoService.getPedidoProductos(params['idPedido'])
        .subscribe((ordenProductos: any) => {
          this.ordenProductos = ordenProductos
        })
    });
    this.productoService.getEnvases()
      .subscribe(((envases: TipoEnvase[]) => {
        this.tipoEnvase = envases;
      }))
  }

  ngOnInit(): void {
  }

  cancelarPedido() {
    let payload = {
      id_ord: this.pedido.id_ord,
      estado_ord: EstadoPedido.Cancelado
    }
    this.productoService.patchPedido(payload)
      .subscribe(data => {
        console.log('pedido cancelado')
        location.reload();
      })
  }

  registrarEnvase() {
    
    if (this.controlEnvase.cantEnvase_ce && this.controlEnvase.tipoEnvase != undefined) {
      let payload = {
        garantia: this.controlEnvase.motivo_ce == 'Salida' ? this.controlEnvase.garantia_ce : 0,
        cantEnvase_ce: this.controlEnvase.cantEnvase_ce,
        motivo_ce: this.controlEnvase.motivo_ce,
        fecha_ce: this.pedido.fEntrega_ord,
        usuario: this.pedido.usuario?.id_usu,
        orden: this.pedido.id_ord,
        tipoEnvase: this.controlEnvase.tipoEnvase.id_envase
      }
      this.productoService.postControlEnvase(payload)
        .subscribe(data => {
          window.location.reload();
        })
    } else {
      console.log('alert ingrese los datos correctamente')
    }


  }

  seleccionarProducto(producto: OrdenProducto) {
    this.productoSeleccionado.id_op = producto.id_op;
    this.productoSeleccionado.precioUni_op = Number(producto.precioUni_op);
    this.productoSeleccionado.cantidad_op = producto.cantidad_op;
  }

  editarPedido() {
    this.pedidoAuxiliar.fVenta_ord = new Date(this.fechaPedido.year, this.fechaPedido.month - 1, this.fechaPedido.day)
    this.pedidoAuxiliar.fEntrega_ord = new Date(this.fechaEntrega.year, this.fechaEntrega.month - 1, this.fechaEntrega.day)
    this.productoService.patchPedido(this.pedidoAuxiliar)
      .subscribe((data: any) => {
        location.reload()
      })
  }

  editarPedidoProducto() {
    this.productoService.patchPedidoProducto(this.productoSeleccionado)
      .subscribe((data: any) => {
        let indexArray = this.ordenProductos.findIndex((op: OrdenProducto) => op.id_op == this.productoSeleccionado.id_op);
        this.ordenProductos[indexArray].cantidad_op = this.productoSeleccionado.cantidad_op;
        this.ordenProductos[indexArray].precioUni_op = this.productoSeleccionado.precioUni_op;
        this.productoSeleccionado = new OrdenProducto();
      })
  }

  changeRadio(event: any) {
    this.pedidoAuxiliar.estado_ord = event.value;
  }

  changeRadioMotivo(event: any) {
    console.log(event.value)
    this.controlEnvase.motivo_ce = event.value;
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

  goIngreso() {
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  }

  goVistaPedido(id: number) {
    this.router.navigate(['admin', this.administrador.id_usu, 'detalle-pedido', id], { replaceUrl: true });
  }

  goVolverPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goVarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }

  goDirecciones() {
    this.router.navigate(['admin', this.administrador.id_usu, 'direcciones'], { replaceUrl: true });
  }

  goLogin() {
    this.router.navigate([''], { replaceUrl: true });
  }
}
