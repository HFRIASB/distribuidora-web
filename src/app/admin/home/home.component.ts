import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { configFromSession } from '@ionic/core';
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
    console.log(this.estados)
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

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
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

  abrirModalEditarEnvase(index: number) {
    // this.envaseSeleccionado = this.envases[index];
  }

  editarEnvase() {

    this.envases.forEach((element, index) => {
      if(this.envaseSeleccionado == element) {
        console.log(index);
      }
    })
    console.log(this.envases.indexOf(this.envaseSeleccionado))
    // this.productoService.updateEnvase(this.envaseSeleccionado).subscribe((data) => {
    //   console.log(this.envases.indexOf(this.envaseSeleccionado))
    //     this.envases[this.envases.indexOf(this.envaseSeleccionado)] = this.envaseSeleccionado;
    //     this.envaseSeleccionado = new TipoEnvase();
    //   }
    // )

    // this.productoService.patchProductos(this.productoSeleccionado).subscribe(data => {
    //   this.productos[this.productos.indexOf(this.productoSeleccionado)] = this.productoSeleccionado;
    //   this.productoSeleccionado = new Producto();
    // })
  }
}
