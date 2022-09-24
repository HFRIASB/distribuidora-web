import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { Meses } from 'src/app/models/enums/meses';
import { Semanas } from 'src/app/models/enums/semanas';
import { Years } from 'src/app/models/enums/years';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {
  actualYear = (new Date()).getFullYear();
  semanas = Object.values(Semanas)
  meses: any;
  years = Object.values(Years)
  administrador: Usuario = new Usuario();
  tabNavegador = 'semanal'
  productos: Producto[] = [];
  filtros = {
    semana: '',
    year: '',
    producto: new Producto(),
    cantidad: 0,
    unidad: ''
  }
  variacionPorcentual: any = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  verTabla = false;
  datosReporte = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
  ) {
    this.meses = Object.values(Meses)
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

  tablNavegador(nav: string) {
    this.tabNavegador = nav;
    this.filtros = {
      semana: '',
      year: '',
      producto: new Producto(),
      cantidad: 0,
      unidad: ''
    }
    this.variacionPorcentual = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.datosReporte = [];
    this.verTabla = false;
  }

  seleccionarProducto(producto: Producto) {
    this.filtros.producto = producto
  }

  aplicarFiltros() {
    if (this.filtros.semana != ''
      && this.filtros.year != ''
      && this.filtros.producto.id_prod != undefined) {
      this.formatoUnidadMedida()
      this.productoService.getProductoVendidoPorYear(
        this.filtros.producto.id_prod.toString(),
        this.getSemana(this.filtros.semana),
        this.filtros.year
      ).subscribe((data: any) => {
        this.verTabla = true;
        this.datosReporte = data;
        for (let index = 1; index < 12; index++) {
          if (this.datosReporte[index - 1] != 0 && this.datosReporte[index] != 0) {
            this.variacionPorcentual[index] = Number((((this.datosReporte[index] * this.filtros.cantidad) / (this.datosReporte[index - 1] * this.filtros.cantidad)) - 1) * 100).toFixed(2);

          }
        }
      })
    } else {
      console.log('alerta ingrese todos los datos')
    }
  }

  aplicarFiltrosMeses() {
    if (
      this.filtros.year != ''
      && this.filtros.producto.id_prod != undefined
    ) {
      this.formatoUnidadMedida()
      this.productoService.getProductoVendidoPorYearMonth(
        this.filtros.producto.id_prod.toString(),
        this.filtros.year
      ).subscribe((data: any) => {
        this.datosReporte = data;
        this.verTabla = true;
        for (let index = 1; index < 12; index++) {
          if (this.datosReporte[index - 1] != 0 && this.datosReporte[index] != 0) {
            this.variacionPorcentual[index] = Number((((this.datosReporte[index] * this.filtros.cantidad) / (this.datosReporte[index - 1] * this.filtros.cantidad)) - 1) * 100).toFixed(2);

          }
        }
      })
    } else {
      console.log('alerta ingrese todos los datos')
    }
  }

  formatoUnidadMedida() {
    if (this.filtros.producto.uniMedida_prod) {
      let formato = this.filtros.producto.uniMedida_prod;
      let cantidad = true;
      let cantidadString = '';
      let medidaString = '';
      for (let i = 0; i < formato.length; i++) {
        if (cantidad) {
          if (formato.charAt(i) == '-')
            cantidad = false;
          else
            cantidadString += formato.charAt(i)
        } else {
          medidaString += formato.charAt(i);
        }
      }
      this.filtros.cantidad = Number(cantidadString);
      this.filtros.unidad = medidaString;
    }
  }

  getSemana(semana: string) {
    if (semana == 'Del 1 al 7') {
      return 'primera';
    } else if (semana == 'Del 8 al 14') {
      return 'segunda'
    } else if (semana == 'Del 15 al 21') {
      return 'tercera'
    } else {
      return 'cuarta';
    }
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
}
