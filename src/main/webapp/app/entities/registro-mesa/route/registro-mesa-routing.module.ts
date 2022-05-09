import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RegistroMesaComponent } from '../list/registro-mesa.component';
import { RegistroMesaDetailComponent } from '../detail/registro-mesa-detail.component';
import { RegistroMesaUpdateComponent } from '../update/registro-mesa-update.component';
import { RegistroMesaRoutingResolveService } from './registro-mesa-routing-resolve.service';

const registroMesaRoute: Routes = [
  {
    path: '',
    component: RegistroMesaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RegistroMesaDetailComponent,
    resolve: {
      registroMesa: RegistroMesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RegistroMesaUpdateComponent,
    resolve: {
      registroMesa: RegistroMesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RegistroMesaUpdateComponent,
    resolve: {
      registroMesa: RegistroMesaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(registroMesaRoute)],
  exports: [RouterModule],
})
export class RegistroMesaRoutingModule {}
