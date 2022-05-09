import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IReserva, Reserva } from '../reserva.model';
import { ReservaService } from '../service/reserva.service';
import { IMesa } from 'app/entities/mesa/mesa.model';
import { MesaService } from 'app/entities/mesa/service/mesa.service';

@Component({
  selector: 'jhi-reserva-update',
  templateUrl: './reserva-update.component.html',
})
export class ReservaUpdateComponent implements OnInit {
  isSaving = false;

  mesasSharedCollection: IMesa[] = [];

  editForm = this.fb.group({
    id: [],
    fecha: [null, [Validators.required]],
    mesa: [],
  });

  constructor(
    protected reservaService: ReservaService,
    protected mesaService: MesaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reserva }) => {
      if (reserva.id === undefined) {
        const today = dayjs().startOf('day');
        reserva.fecha = today;
      }

      this.updateForm(reserva);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reserva = this.createFromForm();
    if (reserva.id !== undefined) {
      this.subscribeToSaveResponse(this.reservaService.update(reserva));
    } else {
      this.subscribeToSaveResponse(this.reservaService.create(reserva));
    }
  }

  trackMesaById(index: number, item: IMesa): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReserva>>): void {
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

  protected updateForm(reserva: IReserva): void {
    this.editForm.patchValue({
      id: reserva.id,
      fecha: reserva.fecha ? reserva.fecha.format(DATE_TIME_FORMAT) : null,
      mesa: reserva.mesa,
    });

    this.mesasSharedCollection = this.mesaService.addMesaToCollectionIfMissing(this.mesasSharedCollection, reserva.mesa);
  }

  protected loadRelationshipsOptions(): void {
    this.mesaService
      .query()
      .pipe(map((res: HttpResponse<IMesa[]>) => res.body ?? []))
      .pipe(map((mesas: IMesa[]) => this.mesaService.addMesaToCollectionIfMissing(mesas, this.editForm.get('mesa')!.value)))
      .subscribe((mesas: IMesa[]) => (this.mesasSharedCollection = mesas));
  }

  protected createFromForm(): IReserva {
    return {
      ...new Reserva(),
      id: this.editForm.get(['id'])!.value,
      fecha: this.editForm.get(['fecha'])!.value ? dayjs(this.editForm.get(['fecha'])!.value, DATE_TIME_FORMAT) : undefined,
      mesa: this.editForm.get(['mesa'])!.value,
    };
  }
}
