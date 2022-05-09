import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IRegistroMesa, RegistroMesa } from '../registro-mesa.model';

import { RegistroMesaService } from './registro-mesa.service';

describe('RegistroMesa Service', () => {
  let service: RegistroMesaService;
  let httpMock: HttpTestingController;
  let elemDefault: IRegistroMesa;
  let expectedResult: IRegistroMesa | IRegistroMesa[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(RegistroMesaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      fecha: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a RegistroMesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.create(new RegistroMesa()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a RegistroMesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a RegistroMesa', () => {
      const patchObject = Object.assign({}, new RegistroMesa());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of RegistroMesa', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          fecha: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          fecha: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a RegistroMesa', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addRegistroMesaToCollectionIfMissing', () => {
      it('should add a RegistroMesa to an empty array', () => {
        const registroMesa: IRegistroMesa = { id: 123 };
        expectedResult = service.addRegistroMesaToCollectionIfMissing([], registroMesa);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroMesa);
      });

      it('should not add a RegistroMesa to an array that contains it', () => {
        const registroMesa: IRegistroMesa = { id: 123 };
        const registroMesaCollection: IRegistroMesa[] = [
          {
            ...registroMesa,
          },
          { id: 456 },
        ];
        expectedResult = service.addRegistroMesaToCollectionIfMissing(registroMesaCollection, registroMesa);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a RegistroMesa to an array that doesn't contain it", () => {
        const registroMesa: IRegistroMesa = { id: 123 };
        const registroMesaCollection: IRegistroMesa[] = [{ id: 456 }];
        expectedResult = service.addRegistroMesaToCollectionIfMissing(registroMesaCollection, registroMesa);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroMesa);
      });

      it('should add only unique RegistroMesa to an array', () => {
        const registroMesaArray: IRegistroMesa[] = [{ id: 123 }, { id: 456 }, { id: 42255 }];
        const registroMesaCollection: IRegistroMesa[] = [{ id: 123 }];
        expectedResult = service.addRegistroMesaToCollectionIfMissing(registroMesaCollection, ...registroMesaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const registroMesa: IRegistroMesa = { id: 123 };
        const registroMesa2: IRegistroMesa = { id: 456 };
        expectedResult = service.addRegistroMesaToCollectionIfMissing([], registroMesa, registroMesa2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(registroMesa);
        expect(expectedResult).toContain(registroMesa2);
      });

      it('should accept null and undefined values', () => {
        const registroMesa: IRegistroMesa = { id: 123 };
        expectedResult = service.addRegistroMesaToCollectionIfMissing([], null, registroMesa, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(registroMesa);
      });

      it('should return initial array if no RegistroMesa is added', () => {
        const registroMesaCollection: IRegistroMesa[] = [{ id: 123 }];
        expectedResult = service.addRegistroMesaToCollectionIfMissing(registroMesaCollection, undefined, null);
        expect(expectedResult).toEqual(registroMesaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
