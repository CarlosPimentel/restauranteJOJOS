import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMesa } from '../mesa.model';
import { MesaService } from '../service/mesa.service';
import { MesaDeleteDialogComponent } from '../delete/mesa-delete-dialog.component';

@Component({
  selector: 'jhi-mesa',
  templateUrl: './mesa.component.html',
  styleUrls: ['./mesa.component.css'],

})
export class MesaComponent implements OnInit {
  mesas?: IMesa[];
  isLoading = false;

  constructor(protected mesaService: MesaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

  
    this.mesaService.devolverUltimasMesas({}).subscribe({
      next: (res: HttpResponse<IMesa[]>) => {
        this.isLoading = false;
        this.mesas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IMesa): number {
    return item.id!;
  }

  delete(mesa: IMesa): void {
    const modalRef = this.modalService.open(MesaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.mesa = mesa;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
