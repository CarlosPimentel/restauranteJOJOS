import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MesaDetailComponent } from './mesa-detail.component';

describe('Mesa Management Detail Component', () => {
  let comp: MesaDetailComponent;
  let fixture: ComponentFixture<MesaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mesa: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MesaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MesaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mesa on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mesa).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
