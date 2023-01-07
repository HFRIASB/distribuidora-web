import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Direccion } from 'src/app/models/direccion';
import { Genero } from 'src/app/models/enums/genero';
import { Pago } from 'src/app/models/pago';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-vista-usuario',
  templateUrl: './vista-usuario.component.html',
  styleUrls: ['./vista-usuario.component.css']
})
export class VistaUsuarioComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined
  fecha: NgbDateStruct = this.calendar.getToday();
  generos = Object.values(Genero);
  searchText: string = '';
  administrador: Usuario = new Usuario();
  usuario: Usuario = new Usuario();
  rol: string = '';
  tabNavegador = "informacion";
  carteraCliente: any[] = [];
  clientes: Usuario[] = [];
  clienteSeleccionado = new Usuario();
  usuarioAuxiliar: Usuario = new Usuario();
  pagoAuxiliar: Pago = new Pago();
  changePassword: boolean = false;
  password = {
    pass: '',
    passConfirm: ''
  }


  direccionAuxiliar: Direccion = new Direccion();
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 10,
  };

  display: any;


  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };
  markerPosition!: google.maps.LatLngLiteral;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private calendar: NgbCalendar,
    public productoService: ProductoService
  ) {
    this.usuario.pago = [];
    this.administrador.pago = [];
    this.usuario.direccion = [];
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        });
      this.authService.getUsuarioById(params['idUsuario'])
        .subscribe((user: any) => {
          this.usuario = user;
          this.setAuxiliar(user);
          this.rol = user.rol.nombre_rol;
          if (this.rol == "Vendedor") {
            this.authService.getCarteraClientes(this.usuario.id_usu?.toString())
              .subscribe((data: any) => {
                this.carteraCliente = data;
              })
            this.authService.getOnlyClientes().subscribe((data: any) => {
              this.clientes = data;
            })
          }
        })
    });
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  changePasswordActive(bool: boolean) {
    this.password.pass = '';
    this.password.passConfirm = '';
    this.changePassword = bool;
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPosition = event.latLng.toJSON();
      this.direccionAuxiliar.lat_direc = event.latLng.toJSON().lat.toString()
      this.direccionAuxiliar.lng_direc = event.latLng.toJSON().lng.toString()
    }
  }

  setAuxiliar(user: Usuario) {
    this.usuarioAuxiliar.id_usu = user.id_usu;
    this.usuarioAuxiliar.nombre_usu = user.nombre_usu;
    this.usuarioAuxiliar.celular_usu = user.celular_usu;
    this.usuarioAuxiliar.nroDocu_usu = user.nroDocu_usu;
    this.usuarioAuxiliar.sexo_usu = user.sexo_usu;
    this.usuarioAuxiliar.observacion_usu = user.observacion_usu;
  }

  editUsuario() {
    let payload = {
      id_usu: this.usuarioAuxiliar.id_usu,
      nombre_usu: this.usuarioAuxiliar.nombre_usu,
      nroDocu_usu: this.usuarioAuxiliar.nroDocu_usu,
      sexo_usu: this.usuarioAuxiliar.sexo_usu,
      celular_usu: this.usuarioAuxiliar.celular_usu,
      observacion_usu: this.usuarioAuxiliar.observacion_usu,
    }
    if (this.changePassword && this.password.pass == this.password.passConfirm && this.usuarioAuxiliar.id_usu !=undefined && this.usuarioAuxiliar.password_usu!=undefined) {
      this.authService.resetPassword(this.usuarioAuxiliar.id_usu, this.usuarioAuxiliar.password_usu)
      .subscribe(()=>{
        
      })
    }
    this.authService.patchUsuario(payload)
      .subscribe((data: any) => {
        window.location.reload()
      })
  }

  tablNavegador(tab: string) {
    this.tabNavegador = tab;
  }

  volverAtras() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  registrarPago(value: any) {
    console.log(value)
    this.authService.realizarPago({
      monto: value.monto,
      usuario: this.usuario.id_usu,
      fecha: new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day)
    }).subscribe(data => {
      this.usuario.pago?.unshift(data)
    })
  }

  selectDireccion(direccion: Direccion) {
    this.direccionAuxiliar.id_direc = direccion.id_direc;
    this.direccionAuxiliar.nombre_direc = direccion.nombre_direc;
    this.direccionAuxiliar.descripcion_direc = direccion.descripcion_direc;
    this.direccionAuxiliar.rubro_direc = direccion.rubro_direc;
    this.direccionAuxiliar.telefono_direc = direccion.telefono_direc;
    if (direccion.lat_direc != undefined && direccion.lng_direc != undefined) {
      this.markerPosition = {
        lat: +direccion.lat_direc,
        lng: +direccion.lng_direc
      }
      this.center = {
        lat: +direccion.lat_direc,
        lng: +direccion.lng_direc
      }
    }
  }

  nuevaDireccionModal() {
    this.direccionAuxiliar = new Direccion();
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.markerPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  saveDireccion() {
    this.direccionAuxiliar.usuario = this.usuario
    this.authService.postNuevaDireccion(this.direccionAuxiliar)
      .subscribe(data => {
        console.log(data)
        window.location.reload()
      })
  }

  editarDireccion() {
    this.authService.patchDireccion(this.direccionAuxiliar)
      .subscribe(data => [
        window.location.reload()
      ])
  }


  getFecha(fecha: any) {
    if (fecha != undefined) {
      return this.productoService.getFechaFormat(fecha.toString())
    } else {
      return this.productoService.getFechaFormat((new Date()).toString())
    }
  }

  regristrarCliente() {
    this.authService.registrarCarteraCliente({
      id_vendedor: this.usuario.id_usu,
      id_cliente: this.clienteSeleccionado.id_usu
    }).subscribe(data => {
      location.reload()
    })
  }

  changeRadioGenero(event: any) {
    this.usuarioAuxiliar.sexo_usu = event.value;
  }

  selectCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
  }

  editarPago(pago: Pago) {
    this.pagoAuxiliar.id_pago = pago.id_pago;
    this.pagoAuxiliar.cantidad_pago = pago.cantidad_pago;
    this.pagoAuxiliar.fecha_pago = pago.fecha_pago;
    if(pago.fecha_pago != undefined){
      let date = new Date(pago.fecha_pago.toString())
      this.fecha =  { day: date.getDate(), month: date.getUTCMonth()+1, year: date.getUTCFullYear()}
      console.log(this.fecha)
    }
   
  }

  guardarPagoEditado() {
    if (this.pagoAuxiliar.cantidad_pago != undefined) {
      if (this.pagoAuxiliar?.cantidad_pago > 0) {
        this.pagoAuxiliar.fecha_pago =  new Date(this.fecha.year, this.fecha.month - 1, this.fecha.day)
        let indexArray = this.usuario.pago?.findIndex((p: Pago) => p.id_pago == this.pagoAuxiliar.id_pago);
        this.authService.patchPago(this.pagoAuxiliar).subscribe(data => {
          if (this.usuario.pago != undefined && indexArray != undefined) {
            this.usuario.pago[indexArray] = this.pagoAuxiliar;
            this.pagoAuxiliar = new Pago()
          }
        })
      } else {
        console.log('alert el numero debe ser mayor a 0')
      }
    }
  }

  deleteClienteCartera(cartera: any) {
    this.authService.deleteCarteraCliente(cartera.id_cc)
      .subscribe(data => {
        console.log('se elimino, toast')
        location.reload();
      })
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

  goClient(id: number) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['admin', this.administrador.id_usu, 'vista-usuario', id], { replaceUrl: true });
    // location.reload();
  }

  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }
  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }
  goIngreso() {
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  }

  goVarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }

  goCFProducto() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-producto'], { replaceUrl: true });
  }

  goCFEnvase() {
    this.router.navigate(['admin', this.administrador.id_usu, 'control-fisico-envase'], { replaceUrl: true });
  }

  goDirecciones() {
    this.router.navigate(['admin', this.administrador.id_usu, 'direcciones'], { replaceUrl: true });
  }

  goLogin() {
    this.router.navigate([''], { replaceUrl: true });
  }
}
