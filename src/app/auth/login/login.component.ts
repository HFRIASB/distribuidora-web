import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    // console.log(this.usuario)
    this.authService.validarUsuario(this.usuario).subscribe(
      data => {
        this.router.navigate(['admin',data.id_usu,'home'], {  replaceUrl: true});
      }, error => {
        console.log(error)
      }
    )
    //let usu = document.getElementById('usuario').value;
    //let password = document.getElementById('password').value;
  }
}
