import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from 'src/app/models/enums/estado';
import { Producto } from 'src/app/models/producto';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  estados:any = Object.keys(Estado)
  administrador: Usuario = new Usuario();
  productos: Producto[] = [];
  productoSeleccionado: Producto = new Producto();
  envaseSeleccionado: TipoEnvase = new TipoEnvase();
  searchText = "";
  tabNavegador = "productos"
  envases: TipoEnvase[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
    });
    this.productoService.getProductos().subscribe((productos: any) => {
      this.productos = productos;
    })
    this.productoService.getEnvases().subscribe((envases: any) => {
      this.envases = envases;
    })
  }

  editarProducto(producto: Producto) {
    this.productoSeleccionado.id_prod = producto.id_prod;
    this.productoSeleccionado.estado_prod = producto.estado_prod;
    this.productoSeleccionado.foto_prod = producto.foto_prod;
    this.productoSeleccionado.nombre_prod = producto.nombre_prod;
    this.productoSeleccionado.precioCompra_prod =producto.precioCompra_prod;
    this.productoSeleccionado.stock_prod = producto.stock_prod;
    this.productoSeleccionado.uniMedida_prod = producto.uniMedida_prod;
  }
  abrirModalEditarEnvase(envase: TipoEnvase) {
    this.envaseSeleccionado.id_envase = envase.id_envase;
    this.envaseSeleccionado.nombre_envase = envase.nombre_envase;
    // this.envaseSeleccionado = this.envases[index];
  }

  editarEnvase() {
    let indexArray = this.envases.findIndex((e: TipoEnvase) => e.id_envase == this.envaseSeleccionado.id_envase);
    this.productoService.updateEnvase(this.envaseSeleccionado).subscribe(data => {
      this.envases[indexArray] = this.envaseSeleccionado;
      this.envaseSeleccionado = new TipoEnvase();
    })
  }

  changeRadio(event: any) {
    this.productoSeleccionado.estado_prod = event.value;
  }

  guardarProductoEditado() {
    let indexArray = this.productos.findIndex((p: Producto) => p.id_prod == this.productoSeleccionado.id_prod);
    this.productoService.patchProductos(this.productoSeleccionado).subscribe(data => {
      this.productos[indexArray] = this.productoSeleccionado;
      this.productoSeleccionado = new Producto();
    })
  }

  nuevoProducto() {
    this.productoSeleccionado = new Producto();
  }

  crearNuevoProducto() {
    if (this.productoSeleccionado.nombre_prod || this.productoSeleccionado.uniMedida_prod || this.productoSeleccionado.stock_prod || this.productoSeleccionado.precioCompra_prod) {
      this.productoService.postProducto(this.productoSeleccionado)
        .subscribe(((data :any) => {
          this.productos.push(data)
          this.productoSeleccionado = new Producto();
        }))
    } else {
      console.log('alerta!')
    }
  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goAlmacen() {
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }

  crearEnvase(nombre_envase: any) {
    this.productoService.postEnvase(nombre_envase.nombre)
      .subscribe(
        (data: any) => {
          this.envases.push(data);
        }
      )
  }

  tablNavegador(dato: string) {
    this.tabNavegador = dato;
  }

  
}
