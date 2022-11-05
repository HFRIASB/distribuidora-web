import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { IngresoProducto } from 'src/app/models/ingreso';
import { EstadoIngreso } from 'src/app/models/enums/estado-ingreso';
import { TipoIngreso } from 'src/app/models/enums/tipo-ingreso';
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
  fecha: NgbDateStruct = this.calendar.getToday();
  searchText = '';
  administrador: Usuario = new Usuario();
  auxiliar: IngresoProducto = new IngresoProducto()
  nuevosRegistros: IngresoProducto[] = [];
  productos: Producto[] = [];

  registroSeleccionado = {
    cantidad: 0,
    index: 0
  };
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
  }

  ngOnInit(): void {
  }

  selectProduct(producto: Producto) {
    let nuevo = new IngresoProducto()
    nuevo.producto = producto;
    this.nuevosRegistros.push(nuevo)
    this.searchText = '';
  }

  seleccionarRegistro(item: IngresoProducto, index: number) {
    this.registroSeleccionado.cantidad = item.cantidad_ingreso_producto;
    this.registroSeleccionado.index = index;
  }

  saveRegistro() {
    this.nuevosRegistros[this.registroSeleccionado.index].cantidad_ingreso_producto = this.registroSeleccionado.cantidad;
  }

  deleteRegistro(index: number){
    this.nuevosRegistros.splice(index,1)
  }

  guardarRegistro() {
    if (this.validarRegistro()) {
      this.auxiliar.fecha_ingreso_producto = new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day)
      this.nuevosRegistros.forEach((n: IngresoProducto, index) => {
        let payload = new IngresoProducto();
        payload.chofer_ingreso_producto = this.auxiliar.chofer_ingreso_producto;
        payload.fecha_ingreso_producto = this.auxiliar.fecha_ingreso_producto;
        payload.cantidad_ingreso_producto = n.cantidad_ingreso_producto;
        payload.producto = n.producto;
        this.productoService.postIngreso(payload)
          .subscribe((data) => {
            this.productoService.patchStockProducto(n.producto.id_prod, n.cantidad_ingreso_producto)
            .subscribe(d=>{
              if (index == this.nuevosRegistros.length - 1) {
                console.log('alert todo se guarodo')
                this.volverIngreso()
              }
            })

          })
      })
    } else {
      console.log('alert de ingresar bien los datos')
    }
  }

  validarRegistro() {
    if (
      this.auxiliar.chofer_ingreso_producto != '' &&
      this.nuevosRegistros.length > 0
    ) {
      return true;
    } else {
      return false;
    }
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

  goVarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }

  volverIngreso() {
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  }

}
