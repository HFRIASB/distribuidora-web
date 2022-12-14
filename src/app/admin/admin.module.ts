import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VistaUsuarioComponent } from './vista-usuario/vista-usuario.component';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PedidosComponent } from './pedidos/pedidos.component';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { IngresoComponent } from './ingreso/ingreso.component';
import { NuevoRegistroComponent } from './nuevo-registro/nuevo-registro.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { GlobalComponent } from './reporte/global/global.component';
import { VariosComponent } from './reporte/varios/varios.component';
import { NgChartsModule } from 'ng2-charts';
import { ProductoComponent } from './control-fisico/producto/producto.component';
import { EnvasesComponent } from './control-fisico/envases/envases.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { DireccionesComponent } from './direcciones/direcciones.component';


@NgModule({
  declarations: [
    HomeComponent,
    UsuariosComponent,
    VistaUsuarioComponent,
    PedidosComponent,
    NuevoPedidoComponent,
    IngresoComponent,
    NuevoRegistroComponent,
    DetallePedidoComponent,
    GlobalComponent,
    VariosComponent,
    ProductoComponent,
    EnvasesComponent,
    DireccionesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgbModule,
    NgChartsModule,
    GoogleMapsModule
  ]
})
export class AdminModule { }
