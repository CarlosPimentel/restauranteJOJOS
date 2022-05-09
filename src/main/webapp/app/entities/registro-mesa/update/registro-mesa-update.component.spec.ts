import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RegistroMesaService } from '../service/registro-mesa.service';
import { IRegistroMesa, RegistroMesa } from '../registro-mesa.model';
import { IMesa } from 'app/entities/mesa/mesa.model';
import { MesaService } from 'app/entities/mesa/service/mesa.service';

import { RegistroMesaUpdateComponent } from './registro-mesa-update.component';

describe('RegistroMesa Management Update Component', () => {
  let comp: RegistroMesaUpdateComponent;
  let fixture: ComponentFixture<RegistroMesaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let registroMesaService: RegistroMesaService;
  let mesaService: MesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RegistroMesaUpdateComponent],
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
      .overrideTemplate(RegistroMesaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RegistroMesaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    registroMesaService = TestBed.inject(RegistroMesaService);
    mesaService = TestBed.inject(MesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mesa query and add missing value', () => {
      const registroMesa: IRegistroMesa = { id: 456 };
      const mesa: IMesa = { id: 55853 };
      registroMesa.mesa = mesa;

      const mesaCollection: IMesa[] = [{ id: 33737 }];
      jest.spyOn(mesaService, 'query').mockReturnValue(of(new HttpResponse({ body: mesaCollection })));
      const additionalMesas = [mesa];
      const expectedCollection: IMesa[] = [...additionalMesas, ...mesaCollection];
      jest.spyOn(mesaService, 'addMesaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ registroMesa });
      comp.ngOnInit();

      expect(mesaService.query).toHaveBeenCalled();
      expect(mesaService.addMesaToCollectionIfMissing).toHaveBeenCalledWith(mesaCollection, ...additionalMesas);
      expect(comp.mesasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const registroMesa: IRegistroMesa = { id: 456 };
      const mesa: IMesa = { id: 52406 };
      registroMesa.mesa = mesa;

      activatedRoute.data = of({ registroMesa });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(registroMesa));
      expect(comp.mesasSharedCollection).toContain(mesa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RegistroMesa>>();
      const registroMesa = { id: 123 };
      jest.spyOn(registroMesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroMesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroMesa }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(registroMesaService.update).toHaveBeenCalledWith(registroMesa);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RegistroMesa>>();
      const registroMesa = new RegistroMesa();
      jest.spyOn(registroMesaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroMesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: registroMesa }));
      saveSubject.complete();

      // THEN
      expect(registroMesaService.create).toHaveBeenCalledWith(registroMesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<RegistroMesa>>();
      const registroMesa = { id: 123 };
      jest.spyOn(registroMesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ registroMesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(registroMesaService.update).toHaveBeenCalledWith(registroMesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackMesaById', () => {
      it('Should return tracked Mesa primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackMesaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
