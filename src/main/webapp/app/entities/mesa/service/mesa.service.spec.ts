import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMesa, Mesa } from '../mesa.model';

import { MesaService } from './mesa.service';

describe('Mesa Service', () => {
  let service: MesaService;
  let httpMock: HttpTestingController;
  let elemDefault: IMesa;
  let expectedResult: IMesa | IMesa[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MesaService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      estado: 0,
      numero: 0,
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

    it('should create a Mesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Mesa()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          estado: 1,
          numero: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mesa', () => {
      const patchObject = Object.assign(
        {
          estado: 1,
        },
        new Mesa()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          estado: 1,
          numero: 1,
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

    it('should delete a Mesa', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMesaToCollectionIfMissing', () => {
      it('should add a Mesa to an empty array', () => {
        const mesa: IMesa = { id: 123 };
        expectedResult = service.addMesaToCollectionIfMissing([], mesa);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mesa);
      });

      it('should not add a Mesa to an array that contains it', () => {
        const mesa: IMesa = { id: 123 };
        const mesaCollection: IMesa[] = [
          {
            ...mesa,
          },
          { id: 456 },
        ];
        expectedResult = service.addMesaToCollectionIfMissing(mesaCollection, mesa);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mesa to an array that doesn't contain it", () => {
        const mesa: IMesa = { id: 123 };
        const mesaCollection: IMesa[] = [{ id: 456 }];
        expectedResult = service.addMesaToCollectionIfMissing(mesaCollection, mesa);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mesa);
      });

      it('should add only unique Mesa to an array', () => {
        const mesaArray: IMesa[] = [{ id: 123 }, { id: 456 }, { id: 26012 }];
        const mesaCollection: IMesa[] = [{ id: 123 }];
        expectedResult = service.addMesaToCollectionIfMissing(mesaCollection, ...mesaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mesa: IMesa = { id: 123 };
        const mesa2: IMesa = { id: 456 };
        expectedResult = service.addMesaToCollectionIfMissing([], mesa, mesa2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mesa);
        expect(expectedResult).toContain(mesa2);
      });

      it('should accept null and undefined values', () => {
        const mesa: IMesa = { id: 123 };
        expectedResult = service.addMesaToCollectionIfMissing([], null, mesa, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mesa);
      });

      it('should return initial array if no Mesa is added', () => {
        const mesaCollection: IMesa[] = [{ id: 123 }];
        expectedResult = service.addMesaToCollectionIfMissing(mesaCollection, undefined, null);
        expect(expectedResult).toEqual(mesaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
