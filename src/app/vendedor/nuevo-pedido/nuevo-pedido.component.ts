import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/models/direccion';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {
  vendedor: Usuario = new Usuario();
  cliente: Usuario = new Usuario();
  clientes: Usuario[] = [];
  direccion: Direccion = new Direccion();
  searchText: string = '';
  fecha: NgbDateStruct = this.calendar.getToday();
  productos: Producto[] = [];
  carrito: any = [];
  carritoSeleccionado = {
    index: 0,
    precio: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private calendar: NgbCalendar,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.cliente.direccion = [];
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.vendedor = user;
        })
      this.authService.getCarteraClientes(params['id'])
        .subscribe((clientes: any) => {
          console.log(clientes)
          this.clientes = clientes;
        })
    });
    this.productoService.getProductos()
      .subscribe(
        (data: Producto[]) => {
          this.productos = data;
        }
      )

  }

  ngOnInit(): void {
  }

  addToCart(producto: Producto) {
    // console.log(producto)
    // let item = 
    // console.log(item)
    this.carrito.push({
      producto: producto,
      cantidad_producto: 1,
      precio: Number(producto.precioCompra_prod)
    })
    console.log(this.carrito)
  }

  savePrecioCarrito() {
    this.carrito[this.carritoSeleccionado.index].precio = this.carritoSeleccionado.precio;
  }

  seleccionarCliente(cliente: Usuario) {
    this.direccion = new Direccion();
    this.cliente = cliente;
  }

  realizarPedido() {
    let payload = {
      fVenta_ord: new Date(),
      fEntrega_ord: new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day),
      usuario: this.cliente.id_usu,
      direccion: this.direccion.id_direc
    }
    if (payload.usuario != undefined
      && payload.direccion != undefined
      && this.carrito.length > 0
    ) {
      this.productoService.postPedido(payload)
        .subscribe((data: any) => {
          console.log(data)
          this.carrito.forEach(async (item: any) => {
            await this.productoService.postDetallePedido(item, data.id_ord)
              .subscribe((detalle: any) => {
              })
          });
          this.goPedidos();
        })
    } else {
      console.log('alerta error en los datos')
    }
  }

  editarPrecioProducto(index: number) {
    this.carritoSeleccionado.index = index;
    this.carritoSeleccionado.precio = this.carrito[index].precio;
  }

  goReportes() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'reportes'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goLogin(){
    this.router.navigate([''], { replaceUrl: true });
  }
}
