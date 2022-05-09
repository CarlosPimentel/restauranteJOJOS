import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'mesa',
        data: { pageTitle: 'restauranteApp.mesa.home.title' },
        loadChildren: () => import('./mesa/mesa.module').then(m => m.MesaModule),
      },
      {
        path: 'producto',
        data: { pageTitle: 'restauranteApp.producto.home.title' },
        loadChildren: () => import('./producto/producto.module').then(m => m.ProductoModule),
      },
      {
        path: 'linea-pedido',
        data: { pageTitle: 'restauranteApp.lineaPedido.home.title' },
        loadChildren: () => import('./linea-pedido/linea-pedido.module').then(m => m.LineaPedidoModule),
      },
      {
        path: 'factura',
        data: { pageTitle: 'restauranteApp.factura.home.title' },
        loadChildren: () => import('./factura/factura.module').then(m => m.FacturaModule),
      },
      {
        path: 'registro-mesa',
        data: { pageTitle: 'restauranteApp.registroMesa.home.title' },
        loadChildren: () => import('./registro-mesa/registro-mesa.module').then(m => m.RegistroMesaModule),
      },
      {
        path: 'reserva',
        data: { pageTitle: 'restauranteApp.reserva.home.title' },
        loadChildren: () => import('./reserva/reserva.module').then(m => m.ReservaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
