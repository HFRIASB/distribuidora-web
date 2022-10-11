import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoPedidoComponent } from './nuevo-pedido/nuevo-pedido.component';
import { PedidoDetalleComponent } from './pedido-detalle/pedido-detalle.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ReporteComponent } from './reporte/reporte.component';
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
		path: 'reportes',
		component: ReporteComponent
	},
	{
		path: 'pedido-detalle/:idOrden',
		component: PedidoDetalleComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendedorRoutingModule { }
