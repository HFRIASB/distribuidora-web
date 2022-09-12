import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenComponent } from './almacen/almacen.component';
import { HomeComponent } from './home/home.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { NuevoRegistroComponent } from './nuevo-registro/nuevo-registro.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { VistaUsuarioComponent } from './vista-usuario/vista-usuario.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'vista-usuario/:idUsuario',
    component: VistaUsuarioComponent
  },
  {
    path: 'pedidos',
    component: PedidosComponent
  },
  {
    path: 'nuevo-pedido',
    component: NuevoPedidoComponent
  },
  {
    path: 'almacen',
    component: AlmacenComponent
  },
  {
    path: 'nuevo-registro',
    component: NuevoRegistroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
