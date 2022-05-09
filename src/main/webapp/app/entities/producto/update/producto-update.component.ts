import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProducto, Producto } from '../producto.model';
import { ProductoService } from '../service/producto.service';

@Component({
  selector: 'jhi-producto-update',
  templateUrl: './producto-update.component.html',
})
export class ProductoUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    tipo: [null, [Validators.required, Validators.min(0), Validators.max(4)]],
    referencia: [null, [Validators.required]],
    nombre: [null, [Validators.required]],
    precio: [null, [Validators.required]],
    iva: [null, [Validators.required]],
    url: [null, [Validators.required]],
  });

  constructor(protected productoService: ProductoService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ producto }) => {
      this.updateForm(producto);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const producto = this.createFromForm();
    if (producto.id !== undefined) {
      this.subscribeToSaveResponse(this.productoService.update(producto));
    } else {
      this.subscribeToSaveResponse(this.productoService.create(producto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProducto>>): void {
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

  protected updateForm(producto: IProducto): void {
    this.editForm.patchValue({
      id: producto.id,
      tipo: producto.tipo,
      referencia: producto.referencia,
      nombre: producto.nombre,
      precio: producto.precio,
      iva: producto.iva,
      url: producto.url,
    });
  }

  protected createFromForm(): IProducto {
    return {
      ...new Producto(),
      id: this.editForm.get(['id'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      referencia: this.editForm.get(['referencia'])!.value,
      nombre: this.editForm.get(['nombre'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      iva: this.editForm.get(['iva'])!.value,
      url: this.editForm.get(['url'])!.value,
    };
  }
}
