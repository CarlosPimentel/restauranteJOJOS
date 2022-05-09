import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRegistroMesa } from '../registro-mesa.model';
import { RegistroMesaService } from '../service/registro-mesa.service';
import { RegistroMesaDeleteDialogComponent } from '../delete/registro-mesa-delete-dialog.component';

@Component({
  selector: 'jhi-registro-mesa',
  templateUrl: './registro-mesa.component.html',
})
export class RegistroMesaComponent implements OnInit {
  registroMesas?: IRegistroMesa[];
  isLoading = false;

  constructor(protected registroMesaService: RegistroMesaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.registroMesaService.query().subscribe({
      next: (res: HttpResponse<IRegistroMesa[]>) => {
        this.isLoading = false;
        this.registroMesas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRegistroMesa): number {
    return item.id!;
  }

  delete(registroMesa: IRegistroMesa): void {
    const modalRef = this.modalService.open(RegistroMesaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.registroMesa = registroMesa;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
