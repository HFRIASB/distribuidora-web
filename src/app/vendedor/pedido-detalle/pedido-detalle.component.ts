import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/models/direccion';
import { EstadoPedido } from 'src/app/models/enums/estado-pedido';
import { Orden } from 'src/app/models/orden';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetalleComponent implements OnInit {
  estadosPedido: any = Object.keys(EstadoPedido)
  vendedor: Usuario = new Usuario();
  pedido: Orden = new Orden();
  direcciones: Direccion[] = [];
  pedidoAuxiliar = new Orden();
  fechaPedido: NgbDateStruct = this.calendar.getToday();
  fechaEntrega: NgbDateStruct = this.calendar.getToday();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.pedidoAuxiliar.direccion = new Direccion();
    this.pedidoAuxiliar.direccion.nombre_direc = ''
    this.route.params.subscribe((params) => {
      this.authService.getUsuarioById(params['id']).subscribe((user: any) => {
        this.vendedor = user;
      });
      this.productoService.getPedidoId(params['idOrden'])
        .subscribe((orden: Orden) => {
          this.pedido = orden;
          this.authService.getUsuarioDireccion(this.pedido.usuario?.id_usu)
            .subscribe((direcciones: Direccion[]) => {
              this.direcciones = direcciones;
            })
          this.pedidoAuxiliar.id_ord = this.pedido.id_ord;
          this.pedidoAuxiliar.estado_ord = this.pedido.estado_ord;
          this.pedidoAuxiliar.direccion = this.pedido.direccion
          let date = new Date(this.pedido.fVenta_ord)
          this.fechaPedido = { day: date.getDate(), month: date.getUTCMonth() + 1, year: date.getUTCFullYear() };
          let date2 = new Date(this.pedido.fEntrega_ord)
          this.fechaEntrega = { day: date2.getDate(), month: date2.getUTCMonth() + 1, year: date2.getUTCFullYear() };
        })
    });
  }

  onClick(direccion: any){
    // console.log(Object.assign({},direccion.value))
    // let direc= new Direccion();
    // direc = direccion.value;
    // console.log(direc)
    // console.log(this.pedidoAuxiliar.direccion)
  }
  goVolverPedidos() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedidos'], { replaceUrl: true });
  }

  getNameDirec(direc: Direccion){
    return direc.nombre_direc;
  }

  formatoFecha(date: Date) {
    let newDate = new Date(date)
    return { day: newDate.getDay(), month: newDate.getMonth() + 1, year: newDate.getFullYear() };
  }

  editPedidos() {
    
    this.pedidoAuxiliar.fVenta_ord = new Date(this.fechaPedido.year, this.fechaPedido.month - 1, this.fechaPedido.day)
    this.pedidoAuxiliar.fEntrega_ord = new Date(this.fechaEntrega.year, this.fechaEntrega.month - 1, this.fechaEntrega.day)
    this.productoService.patchPedidoVendedor(this.pedidoAuxiliar)
      .subscribe((data: any) => {
        location.reload()
      })
  }

  changeRadio(event: any) {
    console.log(event.value)
  }


  ngOnInit(): void {
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

  goPedidos() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedidos'], {
      replaceUrl: true,
    });
  }

  goNuevoPedido() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'nuevo-pedido'], {
      replaceUrl: true,
    });
  }

  goLogin(){
    this.router.navigate([''], { replaceUrl: true });
  }
}
