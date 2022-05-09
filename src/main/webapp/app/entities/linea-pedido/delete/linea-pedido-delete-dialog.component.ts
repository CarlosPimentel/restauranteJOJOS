import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILineaPedido } from '../linea-pedido.model';
import { LineaPedidoService } from '../service/linea-pedido.service';

@Component({
  templateUrl: './linea-pedido-delete-dialog.component.html',
})
export class LineaPedidoDeleteDialogComponent {
  lineaPedido?: ILineaPedido;

  constructor(protected lineaPedidoService: LineaPedidoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.lineaPedidoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
