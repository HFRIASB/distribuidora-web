import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
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
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
