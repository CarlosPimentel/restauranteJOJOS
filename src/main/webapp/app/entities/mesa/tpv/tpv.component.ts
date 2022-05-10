import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { IMesa } from '../mesa.model';
import { MesaService } from '../service/mesa.service';

import { ILineaPedido, LineaPedido } from 'app/entities/linea-pedido/linea-pedido.model';
import { LineaPedidoService } from 'app/entities/linea-pedido/service/linea-pedido.service';

import { Factura, IFactura } from 'app/entities/factura/factura.model';

import dayjs from 'dayjs/esm';
import { FacturaService } from 'app/entities/factura/service/factura.service';

import { IProducto, Producto } from 'app/entities/producto/producto.model';
import { ProductoService } from 'app/entities/producto/service/producto.service';

@Component({
  selector: 'jhi-tpv',
  templateUrl: './tpv.component.html',
  styleUrls: ['./tpv.component.css'],
})
export class tpvComponent implements OnInit {
  isSaving = false;
  // mesa? : IMesa[];
  tipo?: number;
  numeroMesa?: IMesa;
  ocupacion?: number;
  isLoading = false;
  productos?: IProducto[];
  pedidos?: ILineaPedido[];
  nuevaLineaPedido?: LineaPedido;
  lineaPedido?: ILineaPedido;
  lineaPedidoBack?: LineaPedido[] | null;
  lineaPedidosSharedCollection: ILineaPedido[] = [];
  nuevaFactura?: Factura;
  facturaBack?: Factura | null;

  pedido: any;

  constructor(
    protected lineaPedidoService: LineaPedidoService,
    protected mesaService: MesaService,
    protected facturaService: FacturaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected productoService: ProductoService,
    private router: Router
  ) {}

  loadAll(): void {
    this.isLoading = true;

    this.productoService.query().subscribe({
      next: (res: HttpResponse<IProducto[]>) => {
        this.isLoading = false;
        this.productos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

   ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ mesa }) => {
      this.numeroMesa = mesa;
    });

    this.loadAll();
  }
  //metodo para el filtro
  encontrarProductosTipo(tipo: number): void {
    this.isLoading = true;
     this.productoService.findTipoProducto(tipo).subscribe({
      next: (res: HttpResponse<IProducto[]>) => {
        this.isLoading = false;
        this.productos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  } 
}