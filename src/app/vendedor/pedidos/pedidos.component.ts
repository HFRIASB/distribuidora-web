import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Orden } from 'src/app/models/orden';
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
  clientes: Usuario[] = [];
  cliente: Usuario = new Usuario();
  vendedor: Usuario = new Usuario();
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  pedidos: any[] = [];
  pedidosFiltrados: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.route.params.subscribe((params) => {
      this.authService.getUsuarioById(params['id']).subscribe((user: any) => {
        this.vendedor = user;
      });
      this.productoService
        .getOrdenesByVendedor(+params['id'])
        .subscribe((data: any) => {
          this.pedidos = data;
          this.pedidosFiltrados = this.pedidos;
        });
      this.authService
        .getCarteraClientes(params['id'])
        .subscribe((clientes: any) => {
          this.clientes = clientes;
        });
    });
  }

  ngOnInit(): void { }

  seleccionarCliente(cliente: Usuario) {
    this.cliente = cliente;
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
