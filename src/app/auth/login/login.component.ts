import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usuario = {
    correo_usu: null,
    password_usu: null,
  };
  flag = false;
  flagInactive=false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}
  verificar_Usuario() {
    this.authService.validarUsuario(this.usuario).subscribe(
      (data) => {
        this.authService
          .getRolNameByIdUsuario(data.id_usu.toString())
          .subscribe((rol: Rol) => {
            this.authService
              .getUsuarioById(data.id_usu)
              .subscribe((usuario: any) => {
                if (rol.nombre_rol == 'Administrador') {
                  this.router.navigate(['admin', data.id_usu, 'home'], {
                    replaceUrl: true,
                  });
                } else if (
                  rol.nombre_rol == 'Vendedor' &&
                  usuario.estado_usu == 'Activo'
                ) {
                  this.router.navigate(['vendedor', data.id_usu, 'pedidos'], {
                    replaceUrl: true,
                  });
                } else {
                  this.flagInactive=true;
                }
              });
          });
      },
      (error) => {
        console.log(error);
        this.flag = true;
      }
    );
  }

  tamanoString(palabra: any) {
    if (palabra == null) {
      return 0;
    } else {
      return palabra.length;
    }
  }
}
