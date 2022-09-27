import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ControlFisicoEnvase } from 'src/app/models/control-fisico-envase';
import { Meses } from 'src/app/models/enums/meses';
import { Years } from 'src/app/models/enums/years';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-envases',
  templateUrl: './envases.component.html',
  styleUrls: ['./envases.component.css']
})
export class EnvasesComponent implements OnInit {

  administrador: Usuario = new Usuario()
  controles: ControlFisicoEnvase[] = [];
  envases: TipoEnvase[] = [];
  envaseSeleccionado: TipoEnvase | undefined;
  fechaSeleccionada: NgbDateStruct = this.calendar.getToday();
  meses: any = Object.values(Meses);
  years: any = Object.values(Years)
  filtros = {
    mes: (new Date()).getMonth(),
    year: (new Date()).getFullYear().toString()
  }
  valorInicial: number = 0;
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
    this.productoService.getEnvases()
    .subscribe((envases:any)=>{
      this.envases = envases;
    })
  }

  ngOnInit(): void {
  }

  abrirModalEditarControlEnvase(control: ControlFisicoEnvase) {

  }

  saveControlEnvase(f: NgForm) {
    if (this.envaseSeleccionado == undefined) {
      console.log('alert seleccione un envase antes de registrar un control')
    } else {
      if (f.value.detalle) {
        let control: ControlFisicoEnvase = new ControlFisicoEnvase();
        control.fecha_cfe = new Date(this.fechaSeleccionada.year, this.fechaSeleccionada.month - 1, this.fechaSeleccionada.day)
        control.detalle_cfe = f.value.detalle;
        control.entrada_cfe = f.value.entrada ? f.value.entrada : 0;
        control.salida_cfe = f.value.salida ? f.value.salida : 0;
        control.envase = this.envaseSeleccionado;
        this.productoService.postControlFisicoEnvase(control)
          .subscribe((control: any) => {
            console.log(control)
          })
      } else {
        console.log('por favor seleccione una fecha y detalle ALERT')
      }
    }
  }

  aplicarFiltros() {
    if (this.envaseSeleccionado?.id_envase != undefined) {
      this.productoService.getControlFisicoEnvase(this.filtros.mes, this.filtros.year, this.envaseSeleccionado.id_envase)
        .subscribe((control: any) => {
          this.controles = control
          this.generarSaldos();
        })
    } else {
      console.log('seleccione un producto')
    }
  }

  generarSaldos() {
    this.controles.forEach((control: ControlFisicoEnvase, index) => {
      console.log
      if (index == 0) {
        control.saldo_cfe = control.entrada_cfe - control.salida_cfe + this.valorInicial;

      } else {
        control.saldo_cfe = this.controles[index - 1].saldo_cfe + control.entrada_cfe - control.salida_cfe;
      }
    })
  }

  seleccionarTipoEnvase(e: TipoEnvase) {
    this.envaseSeleccionado = new TipoEnvase();
    this.envaseSeleccionado.id_envase = e.id_envase;
    this.envaseSeleccionado.nombre_envase = e.nombre_envase;
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

  goAlmacen() {
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }

  goCFProducto(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

}
