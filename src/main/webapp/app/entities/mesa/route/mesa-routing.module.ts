import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MesaComponent } from '../list/mesa.component';
import { MesaDetailComponent } from '../detail/mesa-detail.component';
import { MesaUpdateComponent } from '../update/mesa-update.component';
import { MesaRoutingResolveService } from './mesa-routing-resolve.service';
import { tpvComponent } from '../tpv/tpv.component';

const mesaRoute: Routes = [
  {
    path: '',
    component: MesaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/tpv',
    component: tpvComponent,
    resolve: {
      mesa: MesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MesaDetailComponent,
    resolve: {
      mesa: MesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MesaUpdateComponent,
    resolve: {
      mesa: MesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MesaUpdateComponent,
    resolve: {
      mesa: MesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(mesaRoute)],
  exports: [RouterModule],
})
export class MesaRoutingModule {}
