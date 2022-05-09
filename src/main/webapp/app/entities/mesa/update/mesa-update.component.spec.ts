import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MesaService } from '../service/mesa.service';
import { IMesa, Mesa } from '../mesa.model';

import { MesaUpdateComponent } from './mesa-update.component';

describe('Mesa Management Update Component', () => {
  let comp: MesaUpdateComponent;
  let fixture: ComponentFixture<MesaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let mesaService: MesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MesaUpdateComponent],
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
      .overrideTemplate(MesaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MesaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    mesaService = TestBed.inject(MesaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const mesa: IMesa = { id: 456 };

      activatedRoute.data = of({ mesa });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(mesa));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesa>>();
      const mesa = { id: 123 };
      jest.spyOn(mesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesa }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(mesaService.update).toHaveBeenCalledWith(mesa);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesa>>();
      const mesa = new Mesa();
      jest.spyOn(mesaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: mesa }));
      saveSubject.complete();

      // THEN
      expect(mesaService.create).toHaveBeenCalledWith(mesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Mesa>>();
      const mesa = { id: 123 };
      jest.spyOn(mesaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ mesa });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(mesaService.update).toHaveBeenCalledWith(mesa);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
