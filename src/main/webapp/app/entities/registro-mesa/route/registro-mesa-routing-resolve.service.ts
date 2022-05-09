import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IRegistroMesa, RegistroMesa } from '../registro-mesa.model';
import { RegistroMesaService } from '../service/registro-mesa.service';

@Injectable({ providedIn: 'root' })
export class RegistroMesaRoutingResolveService implements Resolve<IRegistroMesa> {
  constructor(protected service: RegistroMesaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRegistroMesa> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((registroMesa: HttpResponse<RegistroMesa>) => {
          if (registroMesa.body) {
            return of(registroMesa.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new RegistroMesa());
  }
}
