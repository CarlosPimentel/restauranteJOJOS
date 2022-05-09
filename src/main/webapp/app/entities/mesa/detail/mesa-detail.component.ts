import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMesa } from '../mesa.model';

@Component({
  selector: 'jhi-mesa-detail',
  templateUrl: './mesa-detail.component.html',
})
export class MesaDetailComponent implements OnInit {
  mesa: IMesa | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesa }) => {
      this.mesa = mesa;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
