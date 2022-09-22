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
  semanaSelect: string = '';
  yearSelect: string = '';
  productos: Producto[] = [];
  filtros = {
    semana: '',
    year: '',
    producto: new Producto(),
    cantidad: 0,
    unidad: ''
  }
  datosReporte = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
  ) {
    console.log(this.actualYear)
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
  }

  seleccionarProducto(producto: Producto) {
    this.filtros.producto = producto
  }

  aplicarFiltros() {
    this.meses = Object.values(Meses)
    this.formatoUnidadMedida()
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
