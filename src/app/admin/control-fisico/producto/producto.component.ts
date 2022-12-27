import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlFisicoProducto } from 'src/app/models/control-fisico-producto';
import { Meses } from 'src/app/models/enums/meses';
import { Years } from 'src/app/models/enums/years';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  administrador: Usuario = new Usuario()
  controles: ControlFisicoProducto[] = [];
  productos: Producto[] = [];
  productoSeleccionado: Producto | undefined;
  fechaSeleccionada: NgbDateStruct = this.calendar.getToday();
  meses: any = Object.values(Meses);
  years: any = Object.values(Years)
  filtros = {
    mes: (new Date()).getMonth(),
    year: (new Date()).getFullYear().toString()
  }
  controlSeleccionado: ControlFisicoProducto = new ControlFisicoProducto();
  valorInicial: number = 0;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public productoService: ProductoService,
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

  abrirModalEditarControlProducto(control: ControlFisicoProducto) {
    this.controlSeleccionado.id_cfp = control.id_cfp;
    this.controlSeleccionado.detalle_cfp = control.detalle_cfp;
    this.controlSeleccionado.entrada_cfp = control.entrada_cfp;
    this.controlSeleccionado.salida_cfp = control.salida_cfp;
  }

  editControlProducto(){
    this.productoService.patchControlProducto(this.controlSeleccionado)
    .subscribe(data=>{
      location.reload();
    })
  }

  saveControlProducto(f: NgForm) {
    if (this.productoSeleccionado == undefined) {
      console.log('alert seleccione un producto antes de registrar un control')
    } else {
      if (f.value.detalle) {
        console.log(this.fechaSeleccionada)
        let control: ControlFisicoProducto = new ControlFisicoProducto();
        control.fecha_cfp = new Date(this.fechaSeleccionada.year, this.fechaSeleccionada.month - 1, this.fechaSeleccionada.day)
        control.detalle_cfp = f.value.detalle;
        control.entrada_cfp = f.value.entrada ? f.value.entrada : 0;
        control.salida_cfp = f.value.salida ? f.value.salida : 0;
        control.producto = this.productoSeleccionado;
        this.productoService.postControlProducto(control)
          .subscribe((control: any) => {

          })
      } else {
        console.log('por favor seleccione una fecha y detalle ALERT')
      }
    }
  }

  aplicarFiltros() {
    if (this.productoSeleccionado?.id_prod != undefined) {
      this.productoService.getControlProducto(this.filtros.mes, this.filtros.year, this.productoSeleccionado.id_prod)
        .subscribe((control: any) => {
          this.controles = control
          this.generarSaldos();
        })
    } else {
      console.log('seleccione un producto')
    }
  }

  generarSaldos() {
    this.controles.forEach((control: ControlFisicoProducto, index) => {
      console.log
      if (index == 0) {
        control.saldo_cfp = control.entrada_cfp - control.salida_cfp + this.valorInicial;

      } else {
        control.saldo_cfp = this.controles[index - 1].saldo_cfp + control.entrada_cfp - control.salida_cfp;
      }
    })
  }

  seleccionarProducto(p: Producto) {
    this.productoSeleccionado = new Producto();
    this.productoSeleccionado.id_prod = p.id_prod;
    this.productoSeleccionado.nombre_prod = p.nombre_prod;
    this.productoSeleccionado.uniMedida_prod = p.uniMedida_prod;
  }

  tamanoString(palabra: any) {
    if (palabra == null) {
      return 0;
    } else {
      return palabra.length;
    }
  }

  tamanoNumero(numero: any) {
    if (numero == undefined) {
      return 0;
    } else {
      return numero;
    }
  }

  goCFEnvase() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
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

  goVarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goIngreso() {
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  }

  goDirecciones() {
    this.router.navigate(['admin', this.administrador.id_usu, 'direcciones'], { replaceUrl: true });
  }

  goLogin() {
    this.router.navigate([''], { replaceUrl: true });
  }
}
