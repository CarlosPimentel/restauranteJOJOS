import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReservaService } from '../service/reserva.service';
import { IReserva, Reserva } from '../reserva.model';
import { IMesa } from 'app/entities/mesa/mesa.model';
import { MesaService } from 'app/entities/mesa/service/mesa.service';

import { ReservaUpdateComponent } from './reserva-update.component';

describe('Reserva Management Update Component', () => {
  let comp: ReservaUpdateComponent;
  let fixture: ComponentFixture<ReservaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reservaService: ReservaService;
  let mesaService: MesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReservaUpdateComponent],
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
      .overrideTemplate(ReservaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReservaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reservaService = TestBed.inject(ReservaService);
    mesaService = TestBed.inject(MesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Mesa query and add missing value', () => {
      const reserva: IReserva = { id: 456 };
      const mesa: IMesa = { id: 36332 };
      reserva.mesa = mesa;

      const mesaCollection: IMesa[] = [{ id: 64097 }];
      jest.spyOn(mesaService, 'query').mockReturnValue(of(new HttpResponse({ body: mesaCollection })));
      const additionalMesas = [mesa];
      const expectedCollection: IMesa[] = [...additionalMesas, ...mesaCollection];
      jest.spyOn(mesaService, 'addMesaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(mesaService.query).toHaveBeenCalled();
      expect(mesaService.addMesaToCollectionIfMissing).toHaveBeenCalledWith(mesaCollection, ...additionalMesas);
      expect(comp.mesasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reserva: IReserva = { id: 456 };
      const mesa: IMesa = { id: 54847 };
      reserva.mesa = mesa;

      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reserva));
      expect(comp.mesasSharedCollection).toContain(mesa);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reserva>>();
      const reserva = { id: 123 };
      jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reserva }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reservaService.update).toHaveBeenCalledWith(reserva);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reserva>>();
      const reserva = new Reserva();
      jest.spyOn(reservaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reserva }));
      saveSubject.complete();

      // THEN
      expect(reservaService.create).toHaveBeenCalledWith(reserva);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reserva>>();
      const reserva = { id: 123 };
      jest.spyOn(reservaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reserva });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reservaService.update).toHaveBeenCalledWith(reserva);
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
