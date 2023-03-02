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
  rolCount=0;
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
      this.usuarios.forEach(element=>{
        this.rolCount=this.rolCount+1;
      })
    })
  }

  ngOnInit(): void {
  }

  goVistaUsuario(id: number) {
    this.router.navigate(['admin', 2, 'vista-usuario', id], { replaceUrl: true });
  }

  rolSeleccionado() {
    this.rolCount=0;
    this.authService.getUsuariosByRol(this.rolSelect).subscribe((data: any) => {
      this.usuarios = data;
      this.usuarios.forEach(element=>{
        this.rolCount=this.rolCount+1;
      })
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
        window.location.reload();
      }

    )
    
  }

  goProductos(){
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goPedidos(){
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goIngreso(){
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  }

  goVarios(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase(){
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }

  goDirecciones(){
    this.router.navigate(['admin', this.administrador.id_usu, 'direcciones'], { replaceUrl: true });
  }

  goLogin(){
    this.router.navigate([''], { replaceUrl: true });
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

  title = 'FormValidation';
  mobNumberPattern = "^((\\+91-?|0)?[0-9]{7}$";
  isValidFormSubmitted = false;

}
