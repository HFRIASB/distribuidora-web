import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  activeList = ['Activo', 'Inactivo']
  administrador: Usuario = new Usuario();
  productos: Producto[] = [];
  productoSeleccionado: Producto = new Producto();
  searchText = "";

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productoService: ProductoService
  ) {

  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.productoService.getProductos().subscribe((productos: any) => {
      this.productos = productos;
    })
  }

  editarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
  }

  changeRadio(event: any) {///change Radio
    console.log(this.productoSeleccionado.estado_prod)
  }

  guardarProductoEditado() {
    console.log(this.productoSeleccionado)
    this.productoService.patchProductos(this.productoSeleccionado).subscribe(data => {
      this.productos[this.productos.indexOf(this.productoSeleccionado)] = this.productoSeleccionado;
      this.productoSeleccionado = new Producto();
    })
  }

  nuevoProducto() {
    this.productoSeleccionado = new Producto();
    this.productoSeleccionado.estado_prod = "Activo"
  }

  crearNuevoProducto() {
    if (this.productoSeleccionado.nombre_prod || this.productoSeleccionado.uniMedida_prod || this.productoSeleccionado.stock_prod || this.productoSeleccionado.precioCompra_prod) {
      this.productoService.postProducto(this.productoSeleccionado)
        .subscribe((data => {
          this.productos.push(data)
          this.productoSeleccionado = new Producto();
        }))
    } else {
      console.log('alerta!')
    }
  }
}
