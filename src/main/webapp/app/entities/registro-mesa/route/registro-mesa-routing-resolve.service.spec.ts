import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IRegistroMesa, RegistroMesa } from '../registro-mesa.model';
import { RegistroMesaService } from '../service/registro-mesa.service';

import { RegistroMesaRoutingResolveService } from './registro-mesa-routing-resolve.service';

describe('RegistroMesa routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: RegistroMesaRoutingResolveService;
  let service: RegistroMesaService;
  let resultRegistroMesa: IRegistroMesa | undefined;

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
    routingResolveService = TestBed.inject(RegistroMesaRoutingResolveService);
    service = TestBed.inject(RegistroMesaService);
    resultRegistroMesa = undefined;
  });

  describe('resolve', () => {
    it('should return IRegistroMesa returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRegistroMesa = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRegistroMesa).toEqual({ id: 123 });
    });

    it('should return new IRegistroMesa if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRegistroMesa = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultRegistroMesa).toEqual(new RegistroMesa());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as RegistroMesa })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultRegistroMesa = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultRegistroMesa).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
