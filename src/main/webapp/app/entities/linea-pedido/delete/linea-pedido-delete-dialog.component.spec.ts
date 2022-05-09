jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LineaPedidoService } from '../service/linea-pedido.service';

import { LineaPedidoDeleteDialogComponent } from './linea-pedido-delete-dialog.component';

describe('LineaPedido Management Delete Component', () => {
  let comp: LineaPedidoDeleteDialogComponent;
  let fixture: ComponentFixture<LineaPedidoDeleteDialogComponent>;
  let service: LineaPedidoService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LineaPedidoDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(LineaPedidoDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LineaPedidoDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LineaPedidoService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
