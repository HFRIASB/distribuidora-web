import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCalendar, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Meses } from 'src/app/models/enums/meses';
import { Semanas } from 'src/app/models/enums/semanas';
import { Years } from 'src/app/models/enums/years';
import { Producto } from 'src/app/models/producto';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ChartConfiguration } from 'chart.js';
import { TipoEnvase } from 'src/app/models/tipo-envase';
import { Orden } from 'src/app/models/orden';
import { EstadoPedido } from 'src/app/models/enums/estado-pedido';

@Component({
  selector: 'app-global',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {
  actualYear = (new Date()).getFullYear();
  semanas = Object.values(Semanas)
  meses: any;
  years = Object.values(Years)
  administrador: Usuario = new Usuario();
  tabNavegador = 'cliente'
  productos: Producto[] = [];
  envases:TipoEnvase[]=[]
  clientes:Usuario[]=[]
  ordenesByV = <any[]>[];
  pedidos: any[] = [];
  pedidosTodos: Orden[] = []
  productArray:any
  fechaInicio: NgbDateStruct | undefined;
  fechaFin: NgbDateStruct | undefined;
  filtrosEstados = {
    cliente: new Usuario(),
    estado: 'Todos'
  }
  estados: any = Object.keys(EstadoPedido)
  searchTextCliente: string = '';
  
  filtros = {
    semana: '',
    year: '',
    producto: new Producto(),
    cantidad: 0,
    unidad: ''
  }
  variacionPorcentual: any = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ];
  verTabla = false;
  datosReporte = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private productoService: ProductoService,
  ) {
    this.meses = Object.values(Meses)
    this.route.params.subscribe(params => {
      this.authService.getUsuarioById(params['id'])
        .subscribe((user: any) => {
          this.administrador = user;
        })
    });
    this.productoService.getEnvases().subscribe((envase:TipoEnvase[])=>{
      this.envases=envase;
    })
    this.productoService.getProductos()
      .subscribe((productos: Producto[]) => {
        this.productos = productos;
      })
      this.getClientes();
      this.getOrdenesByVendor();
     
     
  }
  getClientes(){
    this.authService.getOnlyClientes().subscribe((user:any)=>{
      this.clientes=user;
    })
  }
  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };

  ngOnInit(): void {
  }
  getOrdenesByVendor(){
    this.productoService.getPedidosByClient().subscribe(data=>{
      this.ordenesByV=data;
      this.mapFecha();
    }) 
  }
  mapFecha() { //cambiar por map
    this.ordenesByV.forEach((p: Orden) => {
      p.fVenta_ord = new Date(p.fVenta_ord)
      p.fEntrega_ord = new Date(p.fEntrega_ord)
    })
    this.pedidos = this.ordenesByV;
  }
  getFechaFormato(fecha: string) {
    let fechaFormato = new Date(fecha);
    return fechaFormato.getDate() + '/' + (fechaFormato.getMonth() + 1) + '/' + fechaFormato.getFullYear();
  }
  filtrarPorFecha() {
    if (this.fechaInicio && this.fechaFin) {
      let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
      let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
      fin.setHours(23, 59, 59)
      if (inicio.getTime() <= fin.getTime()) {
        this.productoService.getPedidosByClientAndDate(inicio,fin).subscribe((dato)=>{
          this.pedidos=dato;
      this.productArray = Object.entries(this.ordenesByV);
        })
      } else {
        console.log('la fecha de inicio tiene que ser antes que la fecha de final')
      }
    } else {
      console.log('alert ingrese los rangos de fecha')
    }
  }
  
  seleccionarCliente(cliente: Usuario) {
    this.filtrosEstados.cliente = cliente;
    if (this.filtrosEstados.estado == "Todos") {
      if (this.fechaInicio && this.fechaFin) {
        let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
        let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
        fin.setHours(23, 59, 59)
        if (inicio.getTime() <= fin.getTime()) {
          this.pedidos = this.ordenesByV.filter((obj) => {
            return obj.usuario?.id_usu === cliente.id_usu
              && obj.fEntrega_ord.getTime() >= inicio.getTime() &&
              obj.fEntrega_ord.getTime() <= fin.getTime();
          })
          console.log(this.pedidos,'esto devuelve filtrado')
        } else {
          console.log('la fecha de inicio tiene que ser antes que la fecha de final')
        }
      } else {
        this.pedidos = this.ordenesByV.filter((obj) => {
          return obj.usuario?.id_usu === cliente.id_usu;
        })
      }
    } else {
      if (this.fechaInicio && this.fechaFin) {
        let inicio = new Date(this.fechaInicio.year, this.fechaInicio.month - 1, this.fechaInicio.day)
        let fin = new Date(this.fechaFin.year, this.fechaFin.month - 1, this.fechaFin.day)
        fin.setHours(23, 59, 59)
        if (inicio.getTime() <= fin.getTime()) {
          this.pedidos = this.ordenesByV.filter((obj) => {
            return obj.usuario?.id_usu === cliente.id_usu
              && obj.estado_ord === this.filtrosEstados.estado
              && obj.fEntrega_ord.getTime() >= inicio.getTime() &&
              obj.fEntrega_ord.getTime() <= fin.getTime();
          })
        } else {
          console.log('la fecha de inicio tiene que ser antes que la fecha de final')
        }
      } else {
        this.pedidos = this.ordenesByV.filter((obj) => {
          return obj.usuario?.id_usu === cliente.id_usu
            && obj.estado_ord === this.filtrosEstados.estado;
        })
      }
    }
  }
  quitarFiltros() {
    location.reload()
  }


  quitarFiltroCliente() {
    this.pedidos = this.ordenesByV;
    this.filtrosEstados.cliente = new Usuario()
  }
  
  // vendorName(id:any){
  //   for (let index = 0; index < this.clientes.length; index++) {
  //     if(this.clientes[index].id_usu==id){
  //       return this.clientes[index].nombre_usu
  //     }
  //   }
  //   return 0;
  // }

  tablNavegador(nav: string) {
    this.tabNavegador = nav;
    this.filtros = {
      semana: '',
      year: '',
      producto: new Producto(),
      cantidad: 0,
      unidad: ''
    }
    this.variacionPorcentual = [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    this.datosReporte = [];
    this.verTabla = false;
  }

  seleccionarProducto(producto: Producto) {
    this.filtros.producto = producto
  }

  aplicarFiltros() {
    if (this.filtros.semana != ''
      && this.filtros.year != ''
      && this.filtros.producto.id_prod != undefined) {
      this.formatoUnidadMedida()
      this.productoService.getProductoVendidoPorYear(
        this.filtros.producto.id_prod.toString(),
        this.getSemana(this.filtros.semana),
        this.filtros.year
      ).subscribe((data: any) => {
        let dataSet: any = []
        this.verTabla = true;
        this.datosReporte = data;
        for (let index = 1; index < 12; index++) {
          if (this.datosReporte[index - 1] != 0 && this.datosReporte[index] != 0) {
            this.variacionPorcentual[index] = Number((((this.datosReporte[index] * this.filtros.cantidad) / (this.datosReporte[index - 1] * this.filtros.cantidad)) - 1) * 100).toFixed(2);
          }else{
            this.variacionPorcentual[index] = 0;
          }
        }
        this.datosReporte.forEach(e => {
          dataSet.push(e * this.filtros.cantidad)
        })
        this.barChartData = {
          labels: this.meses,
          datasets: [
            { data: dataSet, backgroundColor: ['#fecb007c'], label: this.filtros.unidad + ' vendidos' }
          ]
        };
      })
    } else {
      console.log('alerta ingrese todos los datos')
    }
  }

  aplicarFiltrosMeses() {
    if (
      this.filtros.year != ''
      && this.filtros.producto.id_prod != undefined
    ) {
      this.formatoUnidadMedida()
      this.productoService.getProductoVendidoPorYearMonth(
        this.filtros.producto.id_prod.toString(),
        this.filtros.year
      ).subscribe((data: any) => {
        let dataSet: any = []
        this.datosReporte = data;
        this.verTabla = true;
        for (let index = 1; index < 12; index++) {
          if (this.datosReporte[index - 1] != 0 && this.datosReporte[index] != 0) {
            this.variacionPorcentual[index] = Number((((this.datosReporte[index] * this.filtros.cantidad) / (this.datosReporte[index - 1] * this.filtros.cantidad)) - 1) * 100).toFixed(2);
          } else {
            this.variacionPorcentual[index] = 0;
          }
        }
        this.datosReporte.forEach(e => {
          dataSet.push(e * this.filtros.cantidad)
        })
        this.barChartData = {
          labels: this.meses,
          datasets: [
            { data: dataSet, backgroundColor: ['#fecb007c'], label: this.filtros.unidad + ' vendidos' }
          ]
        };
      })
    } else {
      console.log('alerta ingrese todos los datos')
    }
  }

  formatoUnidadMedida() {
    if (this.filtros.producto.uniMedida_prod) {
      let formato = this.filtros.producto.uniMedida_prod;
      let cantidad = true;
      let cantidadString = '';
      let medidaString = '';
      for (let i = 0; i < formato.length; i++) {
        if (cantidad) {
          if (formato.charAt(i) == '-')
            cantidad = false;
          else
            cantidadString += formato.charAt(i)
        } else {
          medidaString += formato.charAt(i);
        }
      }
      this.filtros.cantidad = Number(cantidadString);
      this.filtros.unidad = medidaString;
    }
  }

  getSemana(semana: string) {
    if (semana == 'Del 1 al 7') {
      return 'primera';
    } else if (semana == 'Del 8 al 14') {
      return 'segunda'
    } else if (semana == 'Del 15 al 21') {
      return 'tercera'
    } else {
      return 'cuarta';
    }
  }

  goProductos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'home'], { replaceUrl: true });
  }

  goIngreso() {
    this.router.navigate(['admin', this.administrador.id_usu, 'ingreso'], { replaceUrl: true });
  } 

  goUsuarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'usuarios'], { replaceUrl: true });
  }

  goPedidos() {
    this.router.navigate(['admin', this.administrador.id_usu, 'pedidos'], { replaceUrl: true });
  }

  goVarios() {
    this.router.navigate(['admin', this.administrador.id_usu, 'reporte-varios'], { replaceUrl: true });
  }

  goGlobal() {
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
