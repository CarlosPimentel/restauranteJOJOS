import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IRegistroMesa, RegistroMesa } from '../registro-mesa.model';
import { RegistroMesaService } from '../service/registro-mesa.service';
import { IMesa } from 'app/entities/mesa/mesa.model';
import { MesaService } from 'app/entities/mesa/service/mesa.service';

@Component({
  selector: 'jhi-registro-mesa-update',
  templateUrl: './registro-mesa-update.component.html',
})
export class RegistroMesaUpdateComponent implements OnInit {
  isSaving = false;

  mesasSharedCollection: IMesa[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    mesa: [],
  });

  constructor(
    protected registroMesaService: RegistroMesaService,
    protected mesaService: MesaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ registroMesa }) => {
      if (registroMesa.id === undefined) {
        const today = dayjs().startOf('day');
        registroMesa.fecha = today;
      }

      this.updateForm(registroMesa);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const registroMesa = this.createFromForm();
    if (registroMesa.id !== undefined) {
      this.subscribeToSaveResponse(this.registroMesaService.update(registroMesa));
    } else {
      this.subscribeToSaveResponse(this.registroMesaService.create(registroMesa));
    }
  }

  trackMesaById(index: number, item: IMesa): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRegistroMesa>>): void {
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

  protected updateForm(registroMesa: IRegistroMesa): void {
    this.editForm.patchValue({
      id: registroMesa.id,
      fecha: registroMesa.fecha ? registroMesa.fecha.format(DATE_TIME_FORMAT) : null,
      mesa: registroMesa.mesa,
    });

    this.mesasSharedCollection = this.mesaService.addMesaToCollectionIfMissing(this.mesasSharedCollection, registroMesa.mesa);
  }

  protected loadRelationshipsOptions(): void {
    this.mesaService
      .query()
      .pipe(map((res: HttpResponse<IMesa[]>) => res.body ?? []))
      .pipe(map((mesas: IMesa[]) => this.mesaService.addMesaToCollectionIfMissing(mesas, this.editForm.get('mesa')!.value)))
      .subscribe((mesas: IMesa[]) => (this.mesasSharedCollection = mesas));
  }

  protected createFromForm(): IRegistroMesa {
    return {
      ...new RegistroMesa(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      mesa: this.editForm.get(['mesa'])!.value,
    };
  }
}
