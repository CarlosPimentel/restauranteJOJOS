import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistroMesa } from '../registro-mesa.model';
import { RegistroMesaService } from '../service/registro-mesa.service';

@Component({
  templateUrl: './registro-mesa-delete-dialog.component.html',
})
export class RegistroMesaDeleteDialogComponent {
  registroMesa?: IRegistroMesa;

  constructor(protected registroMesaService: RegistroMesaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.registroMesaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
