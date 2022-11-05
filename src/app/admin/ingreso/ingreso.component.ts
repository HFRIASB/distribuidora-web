import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { IngresoProducto } from 'src/app/models/ingreso';
import { EstadoIngreso } from 'src/app/models/enums/estado-ingreso';
import { TipoIngreso } from 'src/app/models/enums/tipo-ingreso';
import { Producto } from 'src/app/models/producto';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent implements OnInit {
  searchText: string = '';
  administrador: Usuario = new Usuario();
  ingreso: IngresoProducto[] = [];
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
    this.productoService.getIngreso()
      .subscribe((items: any) => {
        this.ingreso = items;
      })
  }

  ngOnInit(): void {
  }


  deleteIngreso(item: IngresoProducto) {
    this.productoService.deleteIngreso(item.id_ingreso_producto)
    .subscribe(data=> {
      console.log(data)
      this.productoService.patchStockProducto(item.producto.id_prod, -item.cantidad_ingreso_producto)
      .subscribe(stock=>{
        window.location.reload();
      })
    }, error => {
      console.log('alerta ocurrio un error')
    })
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

  goDirecciones(){
    this.router.navigate(['admin', this.administrador.id_usu, 'direcciones'], { replaceUrl: true });
  }

  goLogin(){
    this.router.navigate([''], { replaceUrl: true });
  }
}
