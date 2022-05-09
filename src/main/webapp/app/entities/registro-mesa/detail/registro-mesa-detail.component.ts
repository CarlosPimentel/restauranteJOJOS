import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRegistroMesa } from '../registro-mesa.model';

@Component({
  selector: 'jhi-registro-mesa-detail',
  templateUrl: './registro-mesa-detail.component.html',
})
export class RegistroMesaDetailComponent implements OnInit {
  registroMesa: IRegistroMesa | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroMesa }) => {
      this.registroMesa = registroMesa;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
