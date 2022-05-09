import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IMesa, Mesa } from '../mesa.model';
import { MesaService } from '../service/mesa.service';

@Component({
  selector: 'jhi-mesa-update',
  templateUrl: './mesa-update.component.html',
})
export class MesaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    estado: [null, [Validators.required, Validators.min(0), Validators.max(2)]],
    numero: [null, [Validators.required]],
  });

  constructor(protected mesaService: MesaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesa }) => {
      this.updateForm(mesa);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const mesa = this.createFromForm();
    if (mesa.id !== undefined) {
      this.subscribeToSaveResponse(this.mesaService.update(mesa));
    } else {
      this.subscribeToSaveResponse(this.mesaService.create(mesa));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMesa>>): void {
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

  protected updateForm(mesa: IMesa): void {
    this.editForm.patchValue({
      id: mesa.id,
      estado: mesa.estado,
      numero: mesa.numero,
    });
  }

  protected createFromForm(): IMesa {
    return {
      ...new Mesa(),
      id: this.editForm.get(['id'])!.value,
      estado: this.editForm.get(['estado'])!.value,
      numero: this.editForm.get(['numero'])!.value,
    };
  }
}
