import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FacturaService } from '../service/factura.service';
import { IFactura, Factura } from '../factura.model';
import { IRegistroMesa } from 'app/entities/registro-mesa/registro-mesa.model';
import { RegistroMesaService } from 'app/entities/registro-mesa/service/registro-mesa.service';

import { FacturaUpdateComponent } from './factura-update.component';

describe('Factura Management Update Component', () => {
  let comp: FacturaUpdateComponent;
  let fixture: ComponentFixture<FacturaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let facturaService: FacturaService;
  let registroMesaService: RegistroMesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FacturaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FacturaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FacturaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    facturaService = TestBed.inject(FacturaService);
    registroMesaService = TestBed.inject(RegistroMesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call registroMesa query and add missing value', () => {
      const factura: IFactura = { id: 456 };
      const registroMesa: IRegistroMesa = { id: 53573 };
      factura.registroMesa = registroMesa;

      const registroMesaCollection: IRegistroMesa[] = [{ id: 70885 }];
      jest.spyOn(registroMesaService, 'query').mockReturnValue(of(new HttpResponse({ body: registroMesaCollection })));
      const expectedCollection: IRegistroMesa[] = [registroMesa, ...registroMesaCollection];
      jest.spyOn(registroMesaService, 'addRegistroMesaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ factura });
      comp.ngOnInit();

      expect(registroMesaService.query).toHaveBeenCalled();
      expect(registroMesaService.addRegistroMesaToCollectionIfMissing).toHaveBeenCalledWith(registroMesaCollection, registroMesa);
      expect(comp.registroMesasCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const factura: IFactura = { id: 456 };
      const registroMesa: IRegistroMesa = { id: 97020 };
      factura.registroMesa = registroMesa;

      activatedRoute.data = of({ factura });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(factura));
      expect(comp.registroMesasCollection).toContain(registroMesa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factura>>();
      const factura = { id: 123 };
      jest.spyOn(facturaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factura }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(facturaService.update).toHaveBeenCalledWith(factura);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factura>>();
      const factura = new Factura();
      jest.spyOn(facturaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: factura }));
      saveSubject.complete();

      // THEN
      expect(facturaService.create).toHaveBeenCalledWith(factura);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Factura>>();
      const factura = { id: 123 };
      jest.spyOn(facturaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ factura });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(facturaService.update).toHaveBeenCalledWith(factura);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackRegistroMesaById', () => {
      it('Should return tracked RegistroMesa primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackRegistroMesaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
