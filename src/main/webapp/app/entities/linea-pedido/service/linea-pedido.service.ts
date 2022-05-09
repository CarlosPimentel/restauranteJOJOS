import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILineaPedido, getLineaPedidoIdentifier } from '../linea-pedido.model';

export type EntityResponseType = HttpResponse<ILineaPedido>;
export type EntityArrayResponseType = HttpResponse<ILineaPedido[]>;

@Injectable({ providedIn: 'root' })
export class LineaPedidoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/linea-pedidos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(lineaPedido: ILineaPedido): Observable<EntityResponseType> {
    return this.http.post<ILineaPedido>(this.resourceUrl, lineaPedido, { observe: 'response' });
  }

  update(lineaPedido: ILineaPedido): Observable<EntityResponseType> {
    return this.http.put<ILineaPedido>(`${this.resourceUrl}/${getLineaPedidoIdentifier(lineaPedido) as number}`, lineaPedido, {
      observe: 'response',
    });
  }

  partialUpdate(lineaPedido: ILineaPedido): Observable<EntityResponseType> {
    return this.http.patch<ILineaPedido>(`${this.resourceUrl}/${getLineaPedidoIdentifier(lineaPedido) as number}`, lineaPedido, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILineaPedido>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILineaPedido[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLineaPedidoToCollectionIfMissing(
    lineaPedidoCollection: ILineaPedido[],
    ...lineaPedidosToCheck: (ILineaPedido | null | undefined)[]
  ): ILineaPedido[] {
    const lineaPedidos: ILineaPedido[] = lineaPedidosToCheck.filter(isPresent);
    if (lineaPedidos.length > 0) {
      const lineaPedidoCollectionIdentifiers = lineaPedidoCollection.map(lineaPedidoItem => getLineaPedidoIdentifier(lineaPedidoItem)!);
      const lineaPedidosToAdd = lineaPedidos.filter(lineaPedidoItem => {
        const lineaPedidoIdentifier = getLineaPedidoIdentifier(lineaPedidoItem);
        if (lineaPedidoIdentifier == null || lineaPedidoCollectionIdentifiers.includes(lineaPedidoIdentifier)) {
          return false;
        }
        lineaPedidoCollectionIdentifiers.push(lineaPedidoIdentifier);
        return true;
      });
      return [...lineaPedidosToAdd, ...lineaPedidoCollection];
    }
    return lineaPedidoCollection;
  }
}
