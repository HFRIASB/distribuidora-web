import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Orden } from 'src/app/models/orden';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-varios',
  templateUrl: './varios.component.html',
  styleUrls: ['./varios.component.css']
})
export class VariosComponent implements OnInit {
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  pedidosTodos: Orden[] = [];
  pedidos: Orden[] = [];
  rol: string = '';
  usuario: Usuario = new Usuario();
  carteraCliente: any[] = [];
  Vendedores: Usuario[] = [];
  usuarioAuxiliar: Usuario = new Usuario();
  administrador: Usuario = new Usuario();
  productos: any = [];
  
  ordenesByV = <any[]>[];
  productArray:any
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public productoService: ProductoService,
    private calendar: NgbCalendar
  ) {
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        });
        this.authService.getUsuariosByRol('Vendedor').subscribe((user:any)=>{
          
          this.Vendedores=user;
        })
       
    
    // this.authService.getUsuarioById(params['idUsuario'])
    //     .subscribe((user: any) => {
    //       this.usuario = user;
    //       this.setAuxiliar(user);
    //       this.rol = user.rol.nombre_rol;
    //       if (this.rol == "Vendedor") {
    //         this.authService.getCarteraClientes(this.usuario.id_usu?.toString())
    //           .subscribe((data: any) => {
    //             this.carteraCliente = data;
    //           })
    //         this.authService.getOnlyClientes().subscribe((data: any) => {
    //           this.clientes = data;
    //         })
    //       }
    //     })
      });
      this.getProductos();
      this.getOrdenesByVendor()
   
  }

  ngOnInit(): void {
    this.productoService.getPedidos()
      .subscribe(
        (data: Orden[]) => {
          this.pedidosTodos = data
          console.log(this.pedidosTodos,"esto devuelve")
          this.mapFecha();
        }
      )
  }
  getProductos(){
    this.productoService.getProductos().subscribe(productos=>{
        this.productos=productos;
        console.log(this.productos,"productos")
    })
  }
  getOrdenesByVendor(){
    this.productoService.getPedidosByVendor().subscribe(data=>{
      this.ordenesByV=data;
      this.productArray = Object.entries(this.ordenesByV);
      console.log(this.productArray,"ORDENES POR VENDEDOR")
    })
    
  }
  vendorName(id:any){
    console.log(this.Vendedores,"vendedoressss")
    for (let index = 0; index < this.Vendedores.length; index++) {
      if(this.Vendedores[index].id_usu==id){
        return this.Vendedores[index].nombre_usu
      }
      
    }
    return 0;
  }
  quitarFiltros() {
    location.reload()
  }
  

  setAuxiliar(user: Usuario) {
    this.usuarioAuxiliar.id_usu = user.id_usu;
    this.usuarioAuxiliar.nombre_usu = user.nombre_usu;
    this.usuarioAuxiliar.celular_usu = user.celular_usu;
    this.usuarioAuxiliar.nroDocu_usu = user.nroDocu_usu;
    this.usuarioAuxiliar.sexo_usu = user.sexo_usu;
    this.usuarioAuxiliar.estado_usu=user.estado_usu;
    this.usuarioAuxiliar.observacion_usu = user.observacion_usu;
    this.usuarioAuxiliar.deuda_usu=user.deuda_usu;
    this.usuarioAuxiliar.correo_usu=user.correo_usu;
  }
  
  mapFecha() { //cambiar por map
    this.pedidosTodos.forEach((p: Orden) => {
      p.fVenta_ord = new Date(p.fVenta_ord)
      p.fEntrega_ord = new Date(p.fEntrega_ord)
    })
    this.pedidos = this.pedidosTodos;
  }
  filtrarPorFecha() {
    console.log(this.fechaInicio, this.fechaFin)

    if (this.fechaInicio && this.fechaFin) {
      let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
      let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
      fin.setHours(23, 59, 59)
      if (inicio.getTime() <= fin.getTime()) {
        this.productoService.getPedidosByVendorAndDate(inicio,fin).subscribe((dato)=>{
          this.ordenesByV=dato;
      this.productArray = Object.entries(this.ordenesByV);
          console.log(dato)
        })
        // this.pedidos = this.pedidosTodos.filter((obj) => {
        //   return obj.fEntrega_ord.getTime() >= inicio.getTime() &&
        //     obj.fEntrega_ord.getTime() <= fin.getTime();
        // })
      } else {
        console.log('la fecha de inicio tiene que ser antes que la fecha de final')
      }
    } else {
      console.log('alert ingrese los rangos de fecha')
    }
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
}
