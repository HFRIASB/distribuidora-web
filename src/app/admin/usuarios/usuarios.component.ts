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
  roles: Rol[] = [{nombre_rol: "Todos"}];
  rolSelect: string = "Todos"
  administrador: Usuario = new Usuario();
  usuarios: Usuario[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: Usuario) => {
          this.administrador = user;
        })
    });
    this.authService.getRoles().subscribe((roles: any)=>{
      roles.forEach((rol: Rol) => {
        this.roles.push(rol);
      });
    })
    this.authService.getUsuariosByRol(this.rolSelect).subscribe((data: any) => {
      this.usuarios = data
    })
  }

  goVistaUsuario(id: number) {
    this.router.navigate(['admin',2,'vista-usuario', id], {  replaceUrl: true});
  }

  rolSeleccionado() {
    this.authService.getUsuariosByRol(this.rolSelect).subscribe((data: any) => {
      this.usuarios = data
    })
  }
  seleccionarUsuario(usuario: Usuario) {
    console.log(usuario)
    this.router.navigate(['admin',this.administrador.id_usu,'vista-usuario', usuario.id_usu], {  replaceUrl: true});
  }
}
