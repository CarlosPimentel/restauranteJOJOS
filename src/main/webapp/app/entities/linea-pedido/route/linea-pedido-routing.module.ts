import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LineaPedidoComponent } from '../list/linea-pedido.component';
import { LineaPedidoDetailComponent } from '../detail/linea-pedido-detail.component';
import { LineaPedidoUpdateComponent } from '../update/linea-pedido-update.component';
import { LineaPedidoRoutingResolveService } from './linea-pedido-routing-resolve.service';

const lineaPedidoRoute: Routes = [
  {
    path: '',
    component: LineaPedidoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LineaPedidoDetailComponent,
    resolve: {
      lineaPedido: LineaPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LineaPedidoUpdateComponent,
    resolve: {
      lineaPedido: LineaPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LineaPedidoUpdateComponent,
    resolve: {
      lineaPedido: LineaPedidoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(lineaPedidoRoute)],
  exports: [RouterModule],
})
export class LineaPedidoRoutingModule {}
