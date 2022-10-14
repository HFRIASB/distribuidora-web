import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';

const routes: Routes = [
	{
		path: 'pedidos',
		component: PedidosComponent
	},
	{
		path: 'usuarios',
		component: UsuariosComponent
	},
	{
		path: 'nuevo-pedido',
		component: NuevoPedidoComponent
	},
	{
		path: 'pedido-detalle/:idOrden',
		component: PedidoDetalleComponent
	},
	{
		path: 'detalle-usuario/:idCliente',
		component: DetalleUsuarioComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
