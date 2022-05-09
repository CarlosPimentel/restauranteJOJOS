import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MesaService } from '../service/mesa.service';

import { MesaComponent } from './mesa.component';

describe('Mesa Management Component', () => {
  let comp: MesaComponent;
  let fixture: ComponentFixture<MesaComponent>;
  let service: MesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MesaComponent],
    })
      .overrideTemplate(MesaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MesaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MesaService);

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
    expect(comp.mesas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
