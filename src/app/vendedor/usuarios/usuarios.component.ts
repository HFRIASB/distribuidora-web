import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  vendedor: Usuario = new Usuario();
  searchText: string = ''
  usuarios: any = []
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.vendedor = user;
          this.authService.getCarteraClientes(params['id'])
            .subscribe((data: any) => {
              console.log(data)
              this.usuarios = data;
            })
        })
    });

  }

  ngOnInit(): void {
  }

  seleccionarUsuario(usuario: Usuario) {

  }

  goPedidos(){
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedidos'], { replaceUrl: true });
  }

}
