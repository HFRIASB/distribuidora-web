import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Estado } from 'src/app/models/enums/estado';
import { Genero } from 'src/app/models/enums/genero';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  generos:any = Object.keys(Genero)
  estados:any = Object.keys(Estado)
  searchText = "";
  usuarioAuxiliar: Usuario = new Usuario();
  roles: Rol[] = [{ nombre_rol: "Todos" }];
  rolUsuario: Rol[] = [];
  rolSelect: string = "Todos"
  administrador: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.usuarioAuxiliar.observacion_usu = '';
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
    });
    this.authService.getRoles().subscribe((roles: any) => {
      roles.forEach((rol: Rol) => {
        this.roles.push(rol);
        this.rolUsuario.push(rol)
      });
    })
    this.authService.getUsuariosByRol(this.rolSelect).subscribe((data: any) => {
      this.usuarios = data
    })
  }

  ngOnInit(): void {
  }

  goVistaUsuario(id: number) {
    this.router.navigate(['admin', 2, 'vista-usuario', id], { replaceUrl: true });
  }

  rolSeleccionado() {
    this.authService.getUsuariosByRol(this.rolSelect).subscribe((data: any) => {
      this.usuarios = data
    })
  }
  seleccionarUsuario(usuario: Usuario) {
    this.router.navigate(['admin', this.administrador.id_usu, 'vista-usuario', usuario.id_usu], { replaceUrl: true });
  }

  changeRadioGenero(event: any) {
    this.usuarioAuxiliar.sexo_usu = event.value;
    // console.log(event.value)
  }

  changeRadioEstado(event:any){
    this.usuarioAuxiliar.estado_usu = event.value;
  }

  rolSeleccionadoNuevoUsuario(event: any){
    this.usuarioAuxiliar.rol = event.value;
  }
  registrarUsuario() {
    this.usuarioAuxiliar.fRegistro_usu = new Date();
    this.usuarioAuxiliar.usuario_usu = 'usuario';//eliminar atributo
    console.log(this.usuarioAuxiliar)
    this.authService.registrarUsuario(this.usuarioAuxiliar).subscribe(
      (data: any) => {
        this.usuarios.push(data);
        this.usuarioAuxiliar = new Usuario();
        this.usuarioAuxiliar.observacion_usu = '';
      }
    )
  }

  goProductos(){
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goPedidos(){
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goAlmacen(){
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }
}
