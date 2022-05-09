import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LineaPedidoDetailComponent } from './linea-pedido-detail.component';

describe('LineaPedido Management Detail Component', () => {
  let comp: LineaPedidoDetailComponent;
  let fixture: ComponentFixture<LineaPedidoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LineaPedidoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ lineaPedido: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LineaPedidoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LineaPedidoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load lineaPedido on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.lineaPedido).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
