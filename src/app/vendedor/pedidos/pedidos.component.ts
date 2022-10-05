import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDate, NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';import { Orden } from 'src/app/models/orden';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  vendedor: Usuario = new Usuario();
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  pedidos: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.vendedor = user;
        })
        this.productoService.getOrdenesByVendedor(+params['id']).subscribe((data:any)=>{
          this.pedidos = data;
        })
    });
    
  }

  ngOnInit(): void {
  }

  goReportes() {
    // this.router.navigate(['vendedor', this.vendedor.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goNuevoPedido(){
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'nuevo-pedido'], { replaceUrl: true });
  }
}
