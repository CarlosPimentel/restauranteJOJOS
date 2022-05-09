import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RegistroMesaDetailComponent } from './registro-mesa-detail.component';

describe('RegistroMesa Management Detail Component', () => {
  let comp: RegistroMesaDetailComponent;
  let fixture: ComponentFixture<RegistroMesaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistroMesaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ registroMesa: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(RegistroMesaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(RegistroMesaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load registroMesa on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.registroMesa).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
