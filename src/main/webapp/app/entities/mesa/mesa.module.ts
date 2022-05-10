import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MesaComponent } from './list/mesa.component';
import { MesaDetailComponent } from './detail/mesa-detail.component';
import { MesaUpdateComponent } from './update/mesa-update.component';
import { MesaDeleteDialogComponent } from './delete/mesa-delete-dialog.component';
import { MesaRoutingModule } from './route/mesa-routing.module';
import { tpvComponent } from './tpv/tpv.component';

@NgModule({
  imports: [SharedModule, MesaRoutingModule],
  declarations: [MesaComponent, MesaDetailComponent, MesaUpdateComponent, MesaDeleteDialogComponent, tpvComponent],
  entryComponents: [MesaDeleteDialogComponent],
})
export class MesaModule {}
