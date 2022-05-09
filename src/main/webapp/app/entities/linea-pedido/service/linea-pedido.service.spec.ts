import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILineaPedido, LineaPedido } from '../linea-pedido.model';

import { LineaPedidoService } from './linea-pedido.service';

describe('LineaPedido Service', () => {
  let service: LineaPedidoService;
  let httpMock: HttpTestingController;
  let elemDefault: ILineaPedido;
  let expectedResult: ILineaPedido | ILineaPedido[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LineaPedidoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      precio: 0,
      iva: 0,
      cantidad: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a LineaPedido', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LineaPedido()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LineaPedido', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          precio: 1,
          iva: 1,
          cantidad: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LineaPedido', () => {
      const patchObject = Object.assign(
        {
          precio: 1,
          iva: 1,
          cantidad: 1,
        },
        new LineaPedido()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LineaPedido', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          precio: 1,
          iva: 1,
          cantidad: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a LineaPedido', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLineaPedidoToCollectionIfMissing', () => {
      it('should add a LineaPedido to an empty array', () => {
        const lineaPedido: ILineaPedido = { id: 123 };
        expectedResult = service.addLineaPedidoToCollectionIfMissing([], lineaPedido);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lineaPedido);
      });

      it('should not add a LineaPedido to an array that contains it', () => {
        const lineaPedido: ILineaPedido = { id: 123 };
        const lineaPedidoCollection: ILineaPedido[] = [
          {
            ...lineaPedido,
          },
          { id: 456 },
        ];
        expectedResult = service.addLineaPedidoToCollectionIfMissing(lineaPedidoCollection, lineaPedido);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LineaPedido to an array that doesn't contain it", () => {
        const lineaPedido: ILineaPedido = { id: 123 };
        const lineaPedidoCollection: ILineaPedido[] = [{ id: 456 }];
        expectedResult = service.addLineaPedidoToCollectionIfMissing(lineaPedidoCollection, lineaPedido);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lineaPedido);
      });

      it('should add only unique LineaPedido to an array', () => {
        const lineaPedidoArray: ILineaPedido[] = [{ id: 123 }, { id: 456 }, { id: 96922 }];
        const lineaPedidoCollection: ILineaPedido[] = [{ id: 123 }];
        expectedResult = service.addLineaPedidoToCollectionIfMissing(lineaPedidoCollection, ...lineaPedidoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const lineaPedido: ILineaPedido = { id: 123 };
        const lineaPedido2: ILineaPedido = { id: 456 };
        expectedResult = service.addLineaPedidoToCollectionIfMissing([], lineaPedido, lineaPedido2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(lineaPedido);
        expect(expectedResult).toContain(lineaPedido2);
      });

      it('should accept null and undefined values', () => {
        const lineaPedido: ILineaPedido = { id: 123 };
        expectedResult = service.addLineaPedidoToCollectionIfMissing([], null, lineaPedido, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(lineaPedido);
      });

      it('should return initial array if no LineaPedido is added', () => {
        const lineaPedidoCollection: ILineaPedido[] = [{ id: 123 }];
        expectedResult = service.addLineaPedidoToCollectionIfMissing(lineaPedidoCollection, undefined, null);
        expect(expectedResult).toEqual(lineaPedidoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
