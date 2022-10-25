import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from 'src/app/models/direccion';
import { Genero } from 'src/app/models/enums/genero';
import { Pago } from 'src/app/models/pago';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.css']
})
export class DetalleUsuarioComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap | undefined
  generos = Object.values(Genero);
  vendedor: Usuario = new Usuario();
  cliente: Usuario = new Usuario();
  clienteAuxiliar: Usuario = new Usuario();
  direccionAuxiliar: Direccion = new Direccion();
  pagoAuxiliar: Pago = new Pago();
  tabNavegador = "informacion";


  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 10,
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.vendedor = user;
        })
      this.authService.getUsuarioById(params['idCliente'])
        .subscribe((user: any) => {
          this.cliente = user;
          this.setAuxiliar(user);
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



  // click(event: google.maps.MapMouseEvent) {
  //   console.log(event.latLng?.toJSON().lat)
  //   if (event.latLng) {
  //     console.log('asdf')
  //     this.center.lat = event.latLng.toJSON().lat;
  //     this.center.lng = event.latLng.toJSON().lng;
  //   }

  // }

  setAuxiliar(user: Usuario) {
    this.clienteAuxiliar.id_usu = user.id_usu;
    this.clienteAuxiliar.nombre_usu = user.nombre_usu;
    this.clienteAuxiliar.celular_usu = user.celular_usu;
    this.clienteAuxiliar.nroDocu_usu = user.nroDocu_usu;
    this.clienteAuxiliar.sexo_usu = user.sexo_usu;
    this.clienteAuxiliar.observacion_usu = user.observacion_usu;
  }

  tablNavegador(tab: string) {
    this.tabNavegador = tab;
  }

  changeRadioGenero(event: any) {
    this.clienteAuxiliar.sexo_usu = event.value;
  }


  registrarPago(value: any) {
    console.log(value)
    this.authService.realizarPago({
      monto: value.monto,
      usuario: this.cliente.id_usu
    }).subscribe(data => {
      this.cliente.pago?.unshift(data)
    })
  }

  editarPago(pago: Pago) {
    this.pagoAuxiliar.id_pago = pago.id_pago;
    this.pagoAuxiliar.cantidad_pago = pago.cantidad_pago;
    this.pagoAuxiliar.fecha_pago = pago.fecha_pago;
  }

  editUsuario() {
    this.authService.patchUsuario(this.clienteAuxiliar)
      .subscribe((data: any) => {
        window.location.reload()
      })
  }

  guardarPagoEditado() {
    if (this.pagoAuxiliar.cantidad_pago != undefined) {
      if (this.pagoAuxiliar?.cantidad_pago > 0) {
        let indexArray = this.cliente.pago?.findIndex((p: Pago) => p.id_pago == this.pagoAuxiliar.id_pago);
        this.authService.patchPago(this.pagoAuxiliar).subscribe(data => {
          if (this.cliente.pago != undefined && indexArray != undefined) {
            this.cliente.pago[indexArray] = this.pagoAuxiliar;
            this.pagoAuxiliar = new Pago()
          }
        })
      } else {
        console.log('alert el numero debe ser mayor a 0')
      }
    }
  }

  selectDireccion(direccion: Direccion) {
    this.direccionAuxiliar.id_direc = direccion.id_direc;
    this.direccionAuxiliar.nombre_direc = direccion.nombre_direc;
    this.direccionAuxiliar.descripcion_direc = direccion.descripcion_direc;
    this.direccionAuxiliar.rubro_direc = direccion.rubro_direc;
    this.direccionAuxiliar.telefono_direc = direccion.telefono_direc;
  }

  editarDireccion() {
    this.authService.patchDireccion(this.direccionAuxiliar)
      .subscribe(data => [
        window.location.reload()
      ])
  }

  getFechaFormato(fecha: any) {
    let fechaFormato = new Date(fecha);
    return fechaFormato.getDate() + '/' + (fechaFormato.getMonth() + 1) + '/' + fechaFormato.getFullYear();
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

}
