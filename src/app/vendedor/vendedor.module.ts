import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PedidosComponent } from './pedidos/pedidos.component';
import { VendedorRoutingModule } from './vendedor-routing.module';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';



@NgModule({
  declarations: [
    PedidosComponent,
    UsuariosComponent,
    NuevoPedidoComponent,
    PedidoDetalleComponent,
    DetalleUsuarioComponent
  ],
  imports: [
    CommonModule,
    VendedorRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgbModule
  ]
})
export class VendedorModule { }
