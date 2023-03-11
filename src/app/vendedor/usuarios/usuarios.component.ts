import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from 'src/app/models/enums/estado';
import { Genero } from 'src/app/models/enums/genero';
import { RolEnum } from 'src/app/models/enums/rol';
import { Rol } from 'src/app/models/rol';
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
  usuarios: any = [];
  generos: any = Object.keys(Genero);
  estados: any = Object.keys(Estado);
  rolCliente: any = new Rol();
  usuarioAuxiliar: Usuario = new Usuario();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.usuarioAuxiliar.observacion_usu = '';
    this.getClienteRol();
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.vendedor = user;
          this.authService.getCarteraClientes(params['id'])
            .subscribe((data: any) => {
              this.usuarios = data;
            })
        })
    });

  }

  ngOnInit(): void {
  }

  seleccionarUsuario(usuario: Usuario) {

  }

  registrarUsuario() {
    let usu = {
      nombre_usu: this.usuarioAuxiliar.nombre_usu,
      nroDocu_usu: this.usuarioAuxiliar.nroDocu_usu,
      sexo_usu: this.usuarioAuxiliar.sexo_usu,
      celular_usu: this.usuarioAuxiliar.celular_usu,
      fRegistro_usu: new Date(),
      estado_usu: this.usuarioAuxiliar.estado_usu,
      usuario_usu: 'usuario',
      correo_usu: this.usuarioAuxiliar.correo_usu,
      password_usu: this.usuarioAuxiliar.password_usu,
      observacion_usu: this.usuarioAuxiliar.observacion_usu,
      rol: this.rolCliente.id_rol
    }
    this.authService.registrarUsuario(usu).subscribe(
      (data: Usuario) => {
        this.usuarioAuxiliar = new Usuario();
        this.usuarioAuxiliar.observacion_usu = '';
        this.authService.registrarCarteraCliente({
          id_vendedor: this.vendedor.id_usu,
          id_cliente: data.id_usu
        }).subscribe(data => {
          location.reload()
        })
      }
    )
  }

  tamanoString(palabra: any) {
    if (palabra == null) {
      return 0;
    } else {
      return palabra.length;
    }
  }

  tamanoNumero(numero: any) {
    if (numero == undefined) {
      return 0;
    } else {
      return numero;
    }
  }

  getClienteRol() {
    this.authService.getRolByRolName(RolEnum.cliente)
      .subscribe((rol: Rol) => {
        this.rolCliente = rol;
      })
  }

  changeRadioGenero(event: any) {
    this.usuarioAuxiliar.sexo_usu = event.value;
  }

  changeRadioEstado(event: any) {
    this.usuarioAuxiliar.estado_usu = event.value;
  }

  goReportes() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'reportes'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'pedidos'], { replaceUrl: true });

  }

  goUsuarios() {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goUsuarioDetalle(usuario: Usuario) {
    this.router.navigate(['vendedor', this.vendedor.id_usu, 'detalle-usuario', usuario.id_usu], { replaceUrl: true });
  }
  goLogin(){
    this.router.navigate([''], { replaceUrl: true });

  }
}
