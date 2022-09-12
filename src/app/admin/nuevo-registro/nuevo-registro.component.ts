import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { Almacen } from 'src/app/models/almacen';
import { EstadoAlmacen } from 'src/app/models/enums/estado-almacen';
import { TipoAlmacen } from 'src/app/models/enums/tipo-almacen';
import { Producto } from 'src/app/models/producto';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-nuevo-registro',
  templateUrl: './nuevo-registro.component.html',
  styleUrls: ['./nuevo-registro.component.css']
})
export class NuevoRegistroComponent implements OnInit {
  tipoAlmacen = Object.values(TipoAlmacen);
  estadoAlmacen = Object.values(EstadoAlmacen);
  fecha: NgbDateStruct = this.calendar.getToday();
  searchText = '';
  administrador: Usuario = new Usuario();
  nuevoRegistro: Almacen = new Almacen();
  productos: Producto[] = [];
  envases: TipoEnvase[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
    private calendar: NgbCalendar
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.productoService.getProductos()
      .subscribe((productos: Producto[]) => {
        this.productos = productos;
      })
    this.productoService.getEnvases()
      .subscribe((envases: any) => {
        this.envases = envases;
      })
  }

  ngOnInit(): void {
  }

  cambiarTipoRadio(even: any) {
    this.nuevoRegistro.item_almacen = '';
    this.nuevoRegistro.tipo_almacen = even.value;
  }

  cambiarEstadoRadio(event: any) {
    this.nuevoRegistro.item_almacen = '';
    this.nuevoRegistro.estado_almacen = event.value;
  }

  selectProduct(producto: Producto) {
    this.nuevoRegistro.item_almacen = producto.nombre_prod;
    this.searchText = '';
  }

  selectEnvase(envase: TipoEnvase) {
    this.nuevoRegistro.item_almacen = envase.nombre_envase;
    console.log(envase)
  }

  clearSearch() {
    this.searchText = '';
  }

  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  volverAlmacen() {
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }

  guardarRegistro() {
    if(this.validarRegistro()){
      this.nuevoRegistro.fecha_almacen = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day)
    this.productoService.postAlmacen(this.nuevoRegistro)
      .subscribe((data => {
        console.log(data)
      }))
    }else{
      console.log('alert de ingresar bien los datos')
    }
  }

  validarRegistro() {
    if (
      this.nuevoRegistro.chofer_almacen != '' &&
      this.nuevoRegistro.cantidad_almacen > 0 &&
      this.nuevoRegistro.item_almacen != '' &&
      this.nuevoRegistro.estado_almacen != ''
    ) {
      return true;
    } else {
      return false;
    }
  }
}
