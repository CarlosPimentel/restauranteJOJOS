import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LineaPedidoComponent } from './list/linea-pedido.component';
import { LineaPedidoDetailComponent } from './detail/linea-pedido-detail.component';
import { LineaPedidoUpdateComponent } from './update/linea-pedido-update.component';
import { LineaPedidoDeleteDialogComponent } from './delete/linea-pedido-delete-dialog.component';
import { LineaPedidoRoutingModule } from './route/linea-pedido-routing.module';

@NgModule({
  imports: [SharedModule, LineaPedidoRoutingModule],
  declarations: [LineaPedidoComponent, LineaPedidoDetailComponent, LineaPedidoUpdateComponent, LineaPedidoDeleteDialogComponent],
  entryComponents: [LineaPedidoDeleteDialogComponent],
})
export class LineaPedidoModule {}
