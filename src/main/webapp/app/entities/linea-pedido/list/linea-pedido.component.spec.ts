import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LineaPedidoService } from '../service/linea-pedido.service';

import { LineaPedidoComponent } from './linea-pedido.component';

describe('LineaPedido Management Component', () => {
  let comp: LineaPedidoComponent;
  let fixture: ComponentFixture<LineaPedidoComponent>;
  let service: LineaPedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LineaPedidoComponent],
    })
      .overrideTemplate(LineaPedidoComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LineaPedidoComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LineaPedidoService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.lineaPedidos?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
