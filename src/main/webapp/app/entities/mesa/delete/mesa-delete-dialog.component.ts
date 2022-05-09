import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMesa } from '../mesa.model';
import { MesaService } from '../service/mesa.service';

@Component({
  templateUrl: './mesa-delete-dialog.component.html',
})
export class MesaDeleteDialogComponent {
  mesa?: IMesa;

  constructor(protected mesaService: MesaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.mesaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
