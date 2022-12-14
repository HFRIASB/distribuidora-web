import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from 'src/app/models/direccion';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined
  administrador: Usuario = new Usuario();
  direcciones: Direccion[] = [];
  markers: any = [];

  data = {
    active: false,
    idUser: 0,
    usuario: '',
    nombreDireccion: '',
    descripcionDireccion: '',
    rubroDireccion: '',
    telefono: ''
  };

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
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
    });
    this.authService.getAllDirecciones()
      .subscribe((direcciones: Direccion[]) => {
        this.direcciones = direcciones;
        this.generateMarkers();
      })
  }

  generateMarkers() {
    this.direcciones.forEach(direc => {
      if (direc.lat_direc && direc.lng_direc) {
        this.markers.push({
          position: {
            lat: +direc.lat_direc,
            lng: +direc.lng_direc
          },
          label: {
            text: direc.nombre_direc
          },
          title: direc.nombre_direc
        })
      }
    })
  }

  openInfo(index: any) {
    let nombre = this.direcciones[index].usuario?.nombre_usu;
    let id = this.direcciones[index].usuario?.id_usu;
    if (nombre != undefined && id != undefined) {
      this.data.usuario = nombre;
      this.data.idUser = id;
    }
    this.data.nombreDireccion = this.direcciones[index].nombre_direc;
    this.data.descripcionDireccion = this.direcciones[index].descripcion_direc;
    this.data.rubroDireccion = this.direcciones[index].rubro_direc;
    this.data.telefono = this.direcciones[index].telefono_direc;
    this.data.active = true;
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
  }

  goUser() {
    this.router.navigate(['admin', this.administrador.id_usu, 'vista-usuario', this.data.idUser], { replaceUrl: true });
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
