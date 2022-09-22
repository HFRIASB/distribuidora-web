import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pago } from 'src/app/models/pago';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-vista-usuario',
  templateUrl: './vista-usuario.component.html',
  styleUrls: ['./vista-usuario.component.css']
})
export class VistaUsuarioComponent implements OnInit {
  searchText: string = '';
  administrador: Usuario = new Usuario();
  usuario: Usuario = new Usuario();
  rol: string = '';
  tabNavegador = "informacion";
  carteraCliente: any[] = [];
  clientes: Usuario[] = [];
  clienteSeleccionado = new Usuario();
  pagoAuxiliar: Pago = new Pago();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
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
        .subscribe((user: any)=>{
          this.usuario = user;
          this.rol = user.rol.nombre_rol;
          if(this.rol == "Vendedor") {
            this.authService.getCarteraClientes(this.usuario.id_usu?.toString())
            .subscribe((data: any)=> {
              this.carteraCliente = data;
            })
            this.authService.getOnlyClientes().subscribe((data: any)=> {
              this.clientes = data;
            })
          }
        })
    });
  }

  ngOnInit(): void {
  }

  tablNavegador(tab: string) {
    this.tabNavegador = tab;
  }

  volverAtras(){
    this.router.navigate(['admin',this.administrador.id_usu,'usuarios'], {  replaceUrl: true});
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

  regristrarCliente() {
    this.authService.registrarCarteraCliente({
      id_vendedor: this.usuario.id_usu,
      id_cliente: this.clienteSeleccionado.id_usu
    }).subscribe(data=>{
      location.reload()
    })
  }
  selectCliente(cliente:any){
    this.clienteSeleccionado =cliente;
  }

  editarPago(pago: Pago){
    this.pagoAuxiliar.id_pago = pago.id_pago;
    this.pagoAuxiliar.cantidad_pago = pago.cantidad_pago;
    this.pagoAuxiliar.fecha_pago = pago.fecha_pago;
  }

  guardarPagoEditado(){
    let indexArray = this.usuario.pago?.findIndex((p: Pago) => p.id_pago == this.pagoAuxiliar.id_pago);
    this.authService.patchPago(this.pagoAuxiliar).subscribe(data => {
      if(this.usuario.pago != undefined && indexArray != undefined){
        this.usuario.pago[indexArray] = this.pagoAuxiliar;
        this.pagoAuxiliar = new Pago()
      }
    })
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
  goAlmacen() {
    this.router.navigate(['admin', this.administrador.id_usu, 'almacen'], { replaceUrl: true });
  }

  goVarios(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal(){
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-global'], { replaceUrl: true });
  }
  
}
