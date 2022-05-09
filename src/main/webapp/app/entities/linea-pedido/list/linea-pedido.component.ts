import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILineaPedido } from '../linea-pedido.model';
import { LineaPedidoService } from '../service/linea-pedido.service';
import { LineaPedidoDeleteDialogComponent } from '../delete/linea-pedido-delete-dialog.component';

@Component({
  selector: 'jhi-linea-pedido',
  templateUrl: './linea-pedido.component.html',
})
export class LineaPedidoComponent implements OnInit {
  lineaPedidos?: ILineaPedido[];
  isLoading = false;

  constructor(protected lineaPedidoService: LineaPedidoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.lineaPedidoService.query().subscribe({
      next: (res: HttpResponse<ILineaPedido[]>) => {
        this.isLoading = false;
        this.lineaPedidos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ILineaPedido): number {
    return item.id!;
  }

  delete(lineaPedido: ILineaPedido): void {
    const modalRef = this.modalService.open(LineaPedidoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lineaPedido = lineaPedido;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
