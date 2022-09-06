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



@NgModule({
  declarations: [
    HomeComponent,
    UsuariosComponent,
    VistaUsuarioComponent,
    PedidosComponent,
    NuevoPedidoComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    Ng2SearchPipeModule,
    NgbModule
  ]
})
export class AdminModule { }
