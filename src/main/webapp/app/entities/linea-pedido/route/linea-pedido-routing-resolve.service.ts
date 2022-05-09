import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILineaPedido, LineaPedido } from '../linea-pedido.model';
import { LineaPedidoService } from '../service/linea-pedido.service';

@Injectable({ providedIn: 'root' })
export class LineaPedidoRoutingResolveService implements Resolve<ILineaPedido> {
  constructor(protected service: LineaPedidoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILineaPedido> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((lineaPedido: HttpResponse<LineaPedido>) => {
          if (lineaPedido.body) {
            return of(lineaPedido.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new LineaPedido());
  }
}
