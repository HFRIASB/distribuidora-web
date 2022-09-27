import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlmacenComponent } from './almacen/almacen.component';
import { EnvasesComponent } from './control-fisico/envases/envases.component';
import { ProductoComponent } from './control-fisico/producto/producto.component';
// import { ControlFisicoProductoComponent } from './control-fisico-producto/control-fisico-producto.component';
import { DetallePedidoComponent } from './detalle-pedido/detalle-pedido.component';
import { HomeComponent } from './home/home.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { NuevoRegistroComponent } from './nuevo-registro/nuevo-registro.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { GlobalComponent } from './reporte/global/global.component';
import { VariosComponent } from './reporte/varios/varios.component';
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
  },
  {
    path: 'detalle-pedido/:idPedido',
    component: DetallePedidoComponent
  },
  {
    path: 'reporte-global',
    component: GlobalComponent
  },
  {
    path: 'reporte-varios',
    component: VariosComponent
  },
  {
    path: 'control-fisico-producto',
    component:ProductoComponent
  },
  {
    path: 'control-fisico-envase',
    component: EnvasesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
