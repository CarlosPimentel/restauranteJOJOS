import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RegistroMesaComponent } from './list/registro-mesa.component';
import { RegistroMesaDetailComponent } from './detail/registro-mesa-detail.component';
import { RegistroMesaUpdateComponent } from './update/registro-mesa-update.component';
import { RegistroMesaDeleteDialogComponent } from './delete/registro-mesa-delete-dialog.component';
import { RegistroMesaRoutingModule } from './route/registro-mesa-routing.module';

@NgModule({
  imports: [SharedModule, RegistroMesaRoutingModule],
  declarations: [RegistroMesaComponent, RegistroMesaDetailComponent, RegistroMesaUpdateComponent, RegistroMesaDeleteDialogComponent],
  entryComponents: [RegistroMesaDeleteDialogComponent],
})
export class RegistroMesaModule {}
