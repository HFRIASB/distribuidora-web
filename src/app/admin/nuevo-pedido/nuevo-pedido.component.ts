import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
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
  administrador: Usuario = new Usuario();
  fecha: NgbDateStruct | undefined;
  productos: Producto[] = [];
  carrito: any  = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.productoService.getProductos()
    .subscribe(
      (data: Producto[]) => {
        console.log(data)
        this.productos = data;
      }
    )
  }

  ngOnInit(): void {
  }

  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  addToCart(producto: Producto) {
    this.carrito.push({
      producto: producto,
      cantidad_producto: 1,
    })
  }
}
