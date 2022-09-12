import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from 'src/app/models/rol';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = {
    correo_usu: null,
    password_usu: null
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
  }
  verificar_Usuario() {
    this.authService.validarUsuario(this.usuario).subscribe(
      data => {
        this.authService.getRolNameByIdUsuario(data.id_usu.toString())
          .subscribe((rol: Rol) => {
            console.log(rol.nombre_rol)
            if (rol.nombre_rol == 'Administrador') {
              this.router.navigate(['admin', data.id_usu, 'home'], { replaceUrl: true });
            } else if (rol.nombre_rol == 'Vendedor') {
              this.router.navigate(['vendedor', data.id_usu, 'pedidos'], { replaceUrl: true });
            }
          })
      }, error => {
        console.log(error)
      }
    )
  }
}
