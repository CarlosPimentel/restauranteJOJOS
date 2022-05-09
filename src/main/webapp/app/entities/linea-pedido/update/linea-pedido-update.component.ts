import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILineaPedido, LineaPedido } from '../linea-pedido.model';
import { LineaPedidoService } from '../service/linea-pedido.service';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';
import { RegistroMesaService } from 'app/entities/registro-mesa/service/registro-mesa.service';
import { IProducto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';

@Component({
  selector: 'jhi-linea-pedido-update',
  templateUrl: './linea-pedido-update.component.html',
})
export class LineaPedidoUpdateComponent implements OnInit {
  isSaving = false;

  registroMesasSharedCollection: IRegistroMesa[] = [];
  productosSharedCollection: IProducto[] = [];

  editForm = this.fb.group({
    id: [],
    precio: [null, [Validators.required]],
    iva: [null, [Validators.required]],
    cantidad: [null, [Validators.required]],
    registroMesa: [],
    producto: [],
  });

  constructor(
    protected lineaPedidoService: LineaPedidoService,
    protected registroMesaService: RegistroMesaService,
    protected productoService: ProductoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ lineaPedido }) => {
      this.updateForm(lineaPedido);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const lineaPedido = this.createFromForm();
    if (lineaPedido.id !== undefined) {
      this.subscribeToSaveResponse(this.lineaPedidoService.update(lineaPedido));
    } else {
      this.subscribeToSaveResponse(this.lineaPedidoService.create(lineaPedido));
    }
  }

  trackRegistroMesaById(index: number, item: IRegistroMesa): number {
    return item.id!;
  }

  trackProductoById(index: number, item: IProducto): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILineaPedido>>): void {
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

  protected updateForm(lineaPedido: ILineaPedido): void {
    this.editForm.patchValue({
      id: lineaPedido.id,
      precio: lineaPedido.precio,
      iva: lineaPedido.iva,
      cantidad: lineaPedido.cantidad,
      registroMesa: lineaPedido.registroMesa,
      producto: lineaPedido.producto,
    });

    this.registroMesasSharedCollection = this.registroMesaService.addRegistroMesaToCollectionIfMissing(
      this.registroMesasSharedCollection,
      lineaPedido.registroMesa
    );
    this.productosSharedCollection = this.productoService.addProductoToCollectionIfMissing(
      this.productosSharedCollection,
      lineaPedido.producto
    );
  }

  protected loadRelationshipsOptions(): void {
    this.registroMesaService
      .query()
      .pipe(map((res: HttpResponse<IRegistroMesa[]>) => res.body ?? []))
      .pipe(
        map((registroMesas: IRegistroMesa[]) =>
          this.registroMesaService.addRegistroMesaToCollectionIfMissing(registroMesas, this.editForm.get('registroMesa')!.value)
        )
      )
      .subscribe((registroMesas: IRegistroMesa[]) => (this.registroMesasSharedCollection = registroMesas));

    this.productoService
      .query()
      .pipe(map((res: HttpResponse<IProducto[]>) => res.body ?? []))
      .pipe(
        map((productos: IProducto[]) =>
          this.productoService.addProductoToCollectionIfMissing(productos, this.editForm.get('producto')!.value)
        )
      )
      .subscribe((productos: IProducto[]) => (this.productosSharedCollection = productos));
  }

  protected createFromForm(): ILineaPedido {
    return {
      ...new LineaPedido(),
      id: this.editForm.get(['id'])!.value,
      precio: this.editForm.get(['precio'])!.value,
      iva: this.editForm.get(['iva'])!.value,
      cantidad: this.editForm.get(['cantidad'])!.value,
      registroMesa: this.editForm.get(['registroMesa'])!.value,
      producto: this.editForm.get(['producto'])!.value,
    };
  }
}
