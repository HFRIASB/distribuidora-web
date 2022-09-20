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
  auxiliar: Almacen = new Almacen()
  nuevosRegistros: Almacen[] = [];
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
        .subscribe((user: any) => {
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
    this.nuevosRegistros = [];
    this.auxiliar.tipo_almacen = even.value;
  }

  cambiarEstadoRadio(event: any) {
    this.nuevosRegistros = [];
    this.auxiliar.estado_almacen = event.value;
  }

  selectProduct(producto: Producto) {
    let nuevo = new Almacen()
    nuevo.item_almacen = producto.nombre_prod;
    this.nuevosRegistros.push(nuevo)
    this.searchText = '';
  }

  selectEnvase(envase: TipoEnvase) {
    let nuevo = new Almacen()
    nuevo.item_almacen = envase.nombre_envase;
    this.nuevosRegistros.push(nuevo)
    this.searchText = '';
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
    if (this.validarRegistro()) {
      this.auxiliar.fecha_almacen = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day)
      this.nuevosRegistros.forEach((n: Almacen, index) => {
        let payload = new Almacen();
        payload.chofer_almacen = this.auxiliar.chofer_almacen;
        payload.fecha_almacen = this.auxiliar.fecha_almacen;
        payload.estado_almacen = this.auxiliar.estado_almacen;
        payload.tipo_almacen = this.auxiliar.tipo_almacen;
        payload.item_almacen = n.item_almacen;
        payload.cantidad_almacen = n.cantidad_almacen;
        this.productoService.postAlmacen(payload)
          .subscribe((data) => {
            console.log(index)
            if (index == this.nuevosRegistros.length - 1) {
              console.log('alert todo se guarodo')
            }
          })
      })
    } else {
      console.log('alert de ingresar bien los datos')
    }
  }

  validarRegistro() {
    if (
      this.auxiliar.chofer_almacen != '' &&
      this.nuevosRegistros.length > 0 &&
      this.auxiliar.estado_almacen != ''
    ) {
      return true;
    } else {
      return false;
    }
  }
}
