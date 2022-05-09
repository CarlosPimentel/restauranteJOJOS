import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILineaPedido } from '../linea-pedido.model';

@Component({
  selector: 'jhi-linea-pedido-detail',
  templateUrl: './linea-pedido-detail.component.html',
})
export class LineaPedidoDetailComponent implements OnInit {
  lineaPedido: ILineaPedido | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lineaPedido }) => {
      this.lineaPedido = lineaPedido;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
