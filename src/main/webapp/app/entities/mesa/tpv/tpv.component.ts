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
}
/*
  //metodo para poder mostrar por pantalla los pedidos de la mesa
  cargarPedidos(): void {
    this.isLoading = true; */

    /* this.lineaPedidoService.filtrarpormesa({
      idMesa: this.numeroMesa!.id,
    }).subscribe({
      next: (res: HttpResponse<ILineaPedido[]>) => {
        this.isLoading = false;
        this.pedidos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    }); 
  }*/

  //metodo para comprobar si la mesa esta libre o no y ocuparla de ser necesario
  /*comprobarOcupacion(): void {
    this.isLoading = true;

   /*  this.lineaPedidoService.pedidosOc({}).subscribe({
      next: (res: HttpResponse<number>) => {
        this.isLoading = false;

        this.numeroMesa!.estado = res.body ?? 0;

        this.mesaService.update(this.numeroMesa!).subscribe();
      },
      error: () => {
        this.isLoading = false;
      },
    }); 
  }*/

  //metodo para el filtro
/*  encontrarProductosTipo(tipo: number): void {
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
  } */

  //metodo para crear lineas de pedido y añadir productos
 // addProducto(producto: IProducto): void {
    // Comprobamos si existe ya ese producto en la lista pedidos
  /*   this.lineaPedidoService
      .existeProductoLineaPedido({
        idProducto: producto.id,
        idMesa: this.numeroMesa?.id,
      })
      .subscribe({
        next: (res: HttpResponse<ILineaPedido[]>) => {
          this.isLoading = false;
          this.lineaPedidoBack = res.body ?? null;
 */
          /* if (this.numeroMesa!.estado === 0){
            this.numeroMesa!.estado = 2;
            this.mesaService.update(this.numeroMesa!);
            
          } */

        /*   this.nuevaLineaPedido = new LineaPedido(
            undefined,
            producto.tipo,
            producto.nombre,
            producto.precio,
            producto.iva,
            1,
            this.numeroMesa,
            null,
            producto
          ); */

         /*  if (this.lineaPedidoBack?.length !== undefined && this.lineaPedidoBack.length > 0) {
            this.nuevaLineaPedido = this.lineaPedidoBack[0];
            this.nuevaLineaPedido.cantidad = this.nuevaLineaPedido.cantidad! + 1;

            this.lineaPedidoService.update(this.nuevaLineaPedido).subscribe(resp => {
              this.cargarPedidos();
            });
          } else { */
            // Si no existE

            // Creamos una linea de pedido nueva
           /*  this.lineaPedidoService.create(this.nuevaLineaPedido).subscribe(resp => {
              this.cargarPedidos();
            });
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
  /*  */
  /* cargarlista(): void {
    this.isLoading = true;

    this.lineaPedidoService.query().subscribe({
      next: (res: HttpResponse<ILineaPedido[]>) => {
        this.isLoading = false;
        this.pedidos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    }); 
  } 

 /*  generarFactura(): void {
    this.nuevaFactura = new Factura(undefined, 0, dayjs().hour(dayjs().hour() + 2), this.numeroMesa?.numero, undefined);
    this.facturaService.create(this.nuevaFactura).subscribe({
      next: (res: HttpResponse<IFactura>) => {
        this.isLoading = false;
        this.facturaBack = res.body ?? null;

        this.lineaFacturaService
          .crearLineasFacturas({
            idMesa: this.numeroMesa?.id,
            idFactura: this.facturaBack?.id,
          })
          .subscribe({
            next: (ress: HttpResponse<ILineaFactura[]>) => {
              this.isLoading = false;
              this.router.navigate(['/factura/generarfactura', this.facturaBack?.id]);
            },
            error: () => {
              this.isLoading = false;
            },
          });
      },
      error: () => {
        this.isLoading = false;
      },
    }); 
  }*/
/* 
  trackId(index: number, item: IProducto): number {
    return item.id!;
  }

  trackIdPedido(index: number, item: ILineaPedido): number {
    return item.id!;
  }

  previousState(): void {
    window.history.back();
  }

  sumar(pedido: ILineaPedido): void {
    pedido.cantidad! += 1;
    this.lineaPedidoService.update(pedido).subscribe();
  }
  restar(pedido: ILineaPedido): void {
    pedido.cantidad! -= 1;
    if (pedido.cantidad === 0) {
      this.lineaPedidoService.delete(pedido.id!).subscribe(res => {
        this.cargarPedidos();
      });
    } else {
      this.lineaPedidoService.update(pedido).subscribe(res => {
        this.cargarPedidos();
      });
    }
  } 
}*/
