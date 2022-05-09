import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMesa, Mesa } from '../mesa.model';
import { MesaService } from '../service/mesa.service';

@Injectable({ providedIn: 'root' })
export class MesaRoutingResolveService implements Resolve<IMesa> {
  constructor(protected service: MesaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMesa> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mesa: HttpResponse<Mesa>) => {
          if (mesa.body) {
            return of(mesa.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Mesa());
  }
}
