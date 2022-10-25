import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
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
    this.authService.patchUsuario(this.usuarioAuxiliar)
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
      usuario: this.usuario.id_usu
    }).subscribe(data => {
      this.usuario.pago?.unshift(data)
    })
  }

  getFecha(fecha: any) {
      if(fecha != undefined) {
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
  }

  guardarPagoEditado() {
    if (this.pagoAuxiliar.cantidad_pago != undefined) {
      if (this.pagoAuxiliar?.cantidad_pago > 0) {
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

}
