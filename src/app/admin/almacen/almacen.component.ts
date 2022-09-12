import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Almacen } from 'src/app/models/almacen';
import { TipoAlmacen } from 'src/app/models/enums/tipo-almacen';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrls: ['./almacen.component.css']
})
export class AlmacenComponent implements OnInit {
  tipoAlmacen = Object.values(TipoAlmacen);
  searchText: string = '';
  administrador: Usuario = new Usuario();
  almacen: Almacen[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.productoService.getAlmacen()
    .subscribe((items: any) =>{
      this.almacen = items;
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

  abrirModalEditarItemAlmacen(item: Almacen){
  }
}
