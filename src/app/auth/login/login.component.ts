import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario= {
    correo_usu: "f@gmail.com",
    password_usu: "12345"
  }

  constructor(private authService: AuthService,) {

  }

  ngOnInit(): void {
  }
  verificar_Usuario() {
    this.authService.validarUsuario(this.usuario).subscribe(data=>{
      console.log(data)
    })
    //let usu = document.getElementById('usuario').value;
    //let password = document.getElementById('password').value;
  }
}
