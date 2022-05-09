import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IFactura, Factura } from '../factura.model';
import { FacturaService } from '../service/factura.service';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';
import { RegistroMesaService } from 'app/entities/registro-mesa/service/registro-mesa.service';

@Component({
  selector: 'jhi-factura-update',
  templateUrl: './factura-update.component.html',
})
export class FacturaUpdateComponent implements OnInit {
  isSaving = false;

  registroMesasCollection: IRegistroMesa[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    registroMesa: [],
  });

  constructor(
    protected facturaService: FacturaService,
    protected registroMesaService: RegistroMesaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ factura }) => {
      if (factura.id === undefined) {
        const today = dayjs().startOf('day');
        factura.fecha = today;
      }

      this.updateForm(factura);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const factura = this.createFromForm();
    if (factura.id !== undefined) {
      this.subscribeToSaveResponse(this.facturaService.update(factura));
    } else {
      this.subscribeToSaveResponse(this.facturaService.create(factura));
    }
  }

  trackRegistroMesaById(index: number, item: IRegistroMesa): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFactura>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(factura: IFactura): void {
    this.editForm.patchValue({
      id: factura.id,
      fecha: factura.fecha ? factura.fecha.format(DATE_TIME_FORMAT) : null,
      registroMesa: factura.registroMesa,
    });

    this.registroMesasCollection = this.registroMesaService.addRegistroMesaToCollectionIfMissing(
      this.registroMesasCollection,
      factura.registroMesa
    );
  }

  protected loadRelationshipsOptions(): void {
    this.registroMesaService
      .query({ filter: 'factura-is-null' })
      .pipe(map((res: HttpResponse<IRegistroMesa[]>) => res.body ?? []))
      .pipe(
        map((registroMesas: IRegistroMesa[]) =>
          this.registroMesaService.addRegistroMesaToCollectionIfMissing(registroMesas, this.editForm.get('registroMesa')!.value)
        )
      )
      .subscribe((registroMesas: IRegistroMesa[]) => (this.registroMesasCollection = registroMesas));
  }

  protected createFromForm(): IFactura {
    return {
      ...new Factura(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      registroMesa: this.editForm.get(['registroMesa'])!.value,
    };
  }
}
