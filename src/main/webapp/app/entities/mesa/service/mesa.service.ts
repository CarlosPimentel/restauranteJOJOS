import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMesa, getMesaIdentifier } from '../mesa.model';

export type EntityResponseType = HttpResponse<IMesa>;
export type EntityArrayResponseType = HttpResponse<IMesa[]>;

@Injectable({ providedIn: 'root' })
export class MesaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mesas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(mesa: IMesa): Observable<EntityResponseType> {
    return this.http.post<IMesa>(this.resourceUrl, mesa, { observe: 'response' });
  }

  update(mesa: IMesa): Observable<EntityResponseType> {
    return this.http.put<IMesa>(`${this.resourceUrl}/${getMesaIdentifier(mesa) as number}`, mesa, { observe: 'response' });
  }

  partialUpdate(mesa: IMesa): Observable<EntityResponseType> {
    return this.http.patch<IMesa>(`${this.resourceUrl}/${getMesaIdentifier(mesa) as number}`, mesa, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMesa>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMesa[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMesaToCollectionIfMissing(mesaCollection: IMesa[], ...mesasToCheck: (IMesa | null | undefined)[]): IMesa[] {
    const mesas: IMesa[] = mesasToCheck.filter(isPresent);
    if (mesas.length > 0) {
      const mesaCollectionIdentifiers = mesaCollection.map(mesaItem => getMesaIdentifier(mesaItem)!);
      const mesasToAdd = mesas.filter(mesaItem => {
        const mesaIdentifier = getMesaIdentifier(mesaItem);
        if (mesaIdentifier == null || mesaCollectionIdentifiers.includes(mesaIdentifier)) {
          return false;
        }
        mesaCollectionIdentifiers.push(mesaIdentifier);
        return true;
      });
      return [...mesasToAdd, ...mesaCollection];
    }
    return mesaCollection;
  }
}
