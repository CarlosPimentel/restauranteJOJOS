import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRegistroMesa, getRegistroMesaIdentifier } from '../registro-mesa.model';

export type EntityResponseType = HttpResponse<IRegistroMesa>;
export type EntityArrayResponseType = HttpResponse<IRegistroMesa[]>;

@Injectable({ providedIn: 'root' })
export class RegistroMesaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/registro-mesas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(registroMesa: IRegistroMesa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroMesa);
    return this.http
      .post<IRegistroMesa>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(registroMesa: IRegistroMesa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroMesa);
    return this.http
      .put<IRegistroMesa>(`${this.resourceUrl}/${getRegistroMesaIdentifier(registroMesa) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(registroMesa: IRegistroMesa): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(registroMesa);
    return this.http
      .patch<IRegistroMesa>(`${this.resourceUrl}/${getRegistroMesaIdentifier(registroMesa) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IRegistroMesa>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRegistroMesa[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRegistroMesaToCollectionIfMissing(
    registroMesaCollection: IRegistroMesa[],
    ...registroMesasToCheck: (IRegistroMesa | null | undefined)[]
  ): IRegistroMesa[] {
    const registroMesas: IRegistroMesa[] = registroMesasToCheck.filter(isPresent);
    if (registroMesas.length > 0) {
      const registroMesaCollectionIdentifiers = registroMesaCollection.map(
        registroMesaItem => getRegistroMesaIdentifier(registroMesaItem)!
      );
      const registroMesasToAdd = registroMesas.filter(registroMesaItem => {
        const registroMesaIdentifier = getRegistroMesaIdentifier(registroMesaItem);
        if (registroMesaIdentifier == null || registroMesaCollectionIdentifiers.includes(registroMesaIdentifier)) {
          return false;
        }
        registroMesaCollectionIdentifiers.push(registroMesaIdentifier);
        return true;
      });
      return [...registroMesasToAdd, ...registroMesaCollection];
    }
    return registroMesaCollection;
  }

  protected convertDateFromClient(registroMesa: IRegistroMesa): IRegistroMesa {
    return Object.assign({}, registroMesa, {
      fecha: registroMesa.fecha?.isValid() ? registroMesa.fecha.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.fecha = res.body.fecha ? dayjs(res.body.fecha) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((registroMesa: IRegistroMesa) => {
        registroMesa.fecha = registroMesa.fecha ? dayjs(registroMesa.fecha) : undefined;
      });
    }
    return res;
  }
}
