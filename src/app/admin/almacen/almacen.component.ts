import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Almacen } from 'src/app/models/almacen';
import { EstadoAlmacen } from 'src/app/models/enums/estado-almacen';
import { TipoAlmacen } from 'src/app/models/enums/tipo-almacen';
import { Producto } from 'src/app/models/producto';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {
  estadoAlmacen = Object.values(EstadoAlmacen);
  tipoAlmacen = Object.values(TipoAlmacen);
  searchText: string = '';
  administrador: Usuario = new Usuario();
  almacen: Almacen[] = [];
  almacenSeleccionado: Almacen = new Almacen();
  fechaSeleccionada: NgbDateStruct = this.calendar.getToday();
  envases: TipoEnvase[] = [];
  productos: Producto[] = [];
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
    this.productoService.getAlmacen()
      .subscribe((items: any) => {
        this.almacen = items;
      })

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


  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });

  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  nuevoRegistro() {
    this.router.navigate(['admin', this.administrador.id_usu, 'nuevo-registro'], { replaceUrl: true });
  }

  goVarios(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }

  clearSearch() {
    this.searchText = '';
  }

  abrirModalEditarAlmacen(item: Almacen) {
    this.almacenSeleccionado.id_almacen = item.id_almacen;
    this.almacenSeleccionado.chofer_almacen = item.chofer_almacen;
    this.almacenSeleccionado.item_almacen = item.item_almacen;
    this.almacenSeleccionado.tipo_almacen = item.tipo_almacen;
    this.almacenSeleccionado.cantidad_almacen = item.cantidad_almacen;
    this.almacenSeleccionado.estado_almacen = item.estado_almacen;
    let fecha = new Date(item.fecha_almacen);
    this.fechaSeleccionada = { day: fecha.getDate(), month: fecha.getUTCMonth() + 1, year: fecha.getUTCFullYear() };
  }
  cambiarTipoRadio(even: any) {
    this.almacenSeleccionado.item_almacen = '';
    this.almacenSeleccionado.tipo_almacen = even.value;
  }

  cambiarEstadoRadio(event: any) {
    this.almacenSeleccionado.item_almacen = '';
    this.almacenSeleccionado.estado_almacen = event.value;
  }

  selectProduct(producto: Producto) {
    this.almacenSeleccionado.item_almacen = producto.nombre_prod;
    this.searchText = '';
  }

  selectEnvase(envase: TipoEnvase) {
    this.almacenSeleccionado.item_almacen = envase.nombre_envase;
    this.searchText = '';
  }

  editarAlmacen() {
    this.almacenSeleccionado.fecha_almacen = new Date(this.fechaSeleccionada.year, this.fechaSeleccionada.month - 1, this.fechaSeleccionada.day)
    if (this.almacenSeleccionado.item_almacen != '' &&
      this.almacenSeleccionado.cantidad_almacen > 0
    ) {
      this.productoService.patchAlmacen(this.almacenSeleccionado)
        .subscribe((data: any) => {
          window.location.reload();
        })
    } else {
      console.log('alerta datos erroneos')
    }
  }
}
