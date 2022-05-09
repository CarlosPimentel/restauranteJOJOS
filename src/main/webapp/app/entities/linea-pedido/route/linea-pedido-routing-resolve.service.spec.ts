import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ILineaPedido, LineaPedido } from '../linea-pedido.model';
import { LineaPedidoService } from '../service/linea-pedido.service';

import { LineaPedidoRoutingResolveService } from './linea-pedido-routing-resolve.service';

describe('LineaPedido routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: LineaPedidoRoutingResolveService;
  let service: LineaPedidoService;
  let resultLineaPedido: ILineaPedido | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(LineaPedidoRoutingResolveService);
    service = TestBed.inject(LineaPedidoService);
    resultLineaPedido = undefined;
  });

  describe('resolve', () => {
    it('should return ILineaPedido returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLineaPedido = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLineaPedido).toEqual({ id: 123 });
    });

    it('should return new ILineaPedido if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLineaPedido = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultLineaPedido).toEqual(new LineaPedido());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as LineaPedido })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultLineaPedido = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultLineaPedido).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
