import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rol } from 'src/app/models/rol';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  searchText = "";
  roles: Rol[] = [{ nombre_rol: "Todos" }];
  rolSelect: string = "Todos"
  administrador: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.authService.getRoles().subscribe((roles: any) => {
      // console.log(roles)
      roles.forEach((rol: Rol) => {
        this.roles.push(rol);
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

  registrarUsuario(form: any) {
    let usuario = {
      nombre_usu: form.nombre,
      correo_usu: form.correo,
      usuario_usu: "usuario",//eliminar
      nroDocu_usu: form.nroDoc,
      password_usu: form.password,
      observacion_usu: form.observacion,
      sexo_usu: 'M',////
      estado_usu: 'Activo',
      celular_usu: form.telefono,
      fRegistro_usu: new Date(),
      rol:  1///////;
    }
    this.authService.registrarUsuario(usuario).subscribe(
      (data: Usuario) => {
        location.reload()
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
